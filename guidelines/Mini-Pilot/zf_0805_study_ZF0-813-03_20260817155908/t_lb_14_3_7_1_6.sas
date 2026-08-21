proc format;
value cohortn_cat (notsorted)
    1 = 'Biliary Tract Cancer'
    2 = 'Colorectal Cancer'
    3 = 'Cervical Cancer'
    4 = 'Endometrial Cancer'
    5 = 'Ovarian Cancer'
    6 = 'Non-Small-Cell Lung Cancer'
    7 = 'Other'
    99 = 'Total';
quit;

%let suffix=saf;

/*@block Troponin shift by cohort */
proc sort data=adam.adsl(keep=usubjid saffl cohort cohortn where=(saffl='Y'))
          out=adsl_saf;
  by usubjid;
run;

proc sort data=adam.adlb(
    keep=usubjid param paramcd ablfl anl03fl ontrtfl evllbfl bnrind anrind saffl
    where=(saffl='Y' and evllbfl='Y' and index(upcase(param),'TROPONIN')>0)
  ) out=adlb_saf;
  by usubjid param paramcd;
run;

data lb_base lb_max;
  set adlb_saf;
  length base_cat max_cat $8;

  if ablfl='Y' then do;
    base_cat = upcase(strip(bnrind));
    if base_cat in ('LOW','NORMAL','HIGH') then output lb_base;
  end;

  if ontrtfl='Y' and anl03fl='Y' then do;
    max_cat = upcase(strip(anrind));
    if max_cat in ('LOW','NORMAL','HIGH') then output lb_max;
  end;
run;

proc sort data=lb_base nodupkey;
  by usubjid param paramcd;
run;

proc sort data=lb_max nodupkey;
  by usubjid param paramcd;
run;

data lb_pair;
  merge lb_base(in=inb keep=usubjid param paramcd base_cat)
        lb_max (in=ino keep=usubjid param paramcd max_cat);
  by usubjid param paramcd;
  if inb and ino;
run;

proc sort data=lb_pair;
  by usubjid;
run;

data lb_pair2;
  merge lb_pair(in=inlb)
        adsl_saf(in=inadsl);
  by usubjid;
  if inlb and inadsl;
  if missing(cohortn) then do;
    cohort='Other';
    cohortn=7;
  end;
run;

proc sql;
  create table nobs_cohort as
  select param,
         paramcd,
         cohortn,
         put(cohortn,cohortn_cat.) as cohort length=40,
         count(distinct usubjid) as nobs
  from lb_pair2
  group by param, paramcd, cohortn
  ;

  create table nobs_total as
  select param,
         paramcd,
         99 as cohortn,
         'Total' as cohort length=40,
         count(distinct usubjid) as nobs
  from lb_pair2
  group by param, paramcd
  ;

  create table cnt_cohort as
  select param,
         paramcd,
         cohortn,
         put(cohortn,cohortn_cat.) as cohort length=40,
         base_cat,
         max_cat,
         count(distinct usubjid) as n
  from lb_pair2
  group by param, paramcd, cohortn, base_cat, max_cat
  ;

  create table cnt_total as
  select param,
         paramcd,
         99 as cohortn,
         'Total' as cohort length=40,
         base_cat,
         max_cat,
         count(distinct usubjid) as n
  from lb_pair2
  group by param, paramcd, base_cat, max_cat
  ;
quit;

data cnt_all;
  set cnt_cohort cnt_total;
run;

data nobs_all;
  set nobs_cohort nobs_total;
run;

proc sort data=cnt_all;
  by param paramcd cohortn base_cat;
run;

proc transpose data=cnt_all out=cnt_wide prefix=max_;
  by param paramcd cohortn cohort base_cat;
  id max_cat;
  var n;
run;

data skeleton;
  length base_cat $8;
  do cohortn=1 to 7, 99;
    do base_cat='LOW','NORMAL','HIGH';
      output;
    end;
  end;
run;

proc sql;
  create table page_list as
  select distinct param, paramcd
  from lb_pair2
  ;
quit;

proc sort data=page_list;
  by param paramcd;
run;

proc sort data=skeleton;
  by cohortn base_cat;
run;

proc sort data=nobs_all;
  by param paramcd cohortn;
run;

proc sort data=cnt_wide;
  by param paramcd cohortn base_cat;
run;

data skeleton_page;
  merge page_list(in=inp)
        skeleton(in=ins);
  if inp and ins;
run;

proc sort data=skeleton_page;
  by param paramcd cohortn base_cat;
run;

data shift_rows;
  merge skeleton_page(in=insk)
        nobs_all(in=innobs)
        cnt_wide(in=inw);
  by param paramcd cohortn base_cat;
  if insk and innobs;
  length cohort $40 base_label $12 max_low max_normal max_high max_total $20;
  if missing(cohort) then cohort=put(cohortn,cohortn_cat.);
  if not inw then call missing(max_LOW,max_NORMAL,max_HIGH);

  max_low_n    = sum(max_LOW,0);
  max_normal_n = sum(max_NORMAL,0);
  max_high_n   = sum(max_HIGH,0);
  max_total_n  = sum(max_low_n,max_normal_n,max_high_n);

  base_label = propcase(lowcase(base_cat));

  max_low    = cats(put(max_low_n, best.), ' (', put(100*divide(max_low_n,nobs), 5.1), ')');
  max_normal = cats(put(max_normal_n, best.), ' (', put(100*divide(max_normal_n,nobs), 5.1), ')');
  max_high   = cats(put(max_high_n, best.), ' (', put(100*divide(max_high_n,nobs), 5.1), ')');
  max_total  = cats(put(max_total_n, best.), ' (', put(100*divide(max_total_n,nobs), 5.1), ')');
run;

proc sql;
  create table total_rows as
  select param,
         paramcd,
         cohortn,
         cohort,
         nobs,
         'Total' as base_label length=12,
         sum(max_low_n) as max_low_n,
         sum(max_normal_n) as max_normal_n,
         sum(max_high_n) as max_high_n,
         sum(max_total_n) as max_total_n
  from shift_rows
  group by param, paramcd, cohortn, cohort, nobs
  ;
quit;

data total_rows;
  set total_rows;
  length max_low max_normal max_high max_total $20;
  max_low    = cats(put(max_low_n, best.), ' (', put(100*divide(max_low_n,nobs), 5.1), ')');
  max_normal = cats(put(max_normal_n, best.), ' (', put(100*divide(max_normal_n,nobs), 5.1), ')');
  max_high   = cats(put(max_high_n, best.), ' (', put(100*divide(max_high_n,nobs), 5.1), ')');
  max_total  = cats(put(max_total_n, best.), ' (', put(100*divide(max_total_n,nobs), 5.1), ')');
run;

data table_rows;
  set shift_rows total_rows;
  length base_order 8 group_disp $80 col1-col7 $200;
  select (base_label);
    when ('Low')    base_order=1;
    when ('Normal') base_order=2;
    when ('High')   base_order=3;
    when ('Total')  base_order=4;
    otherwise       base_order=9;
  end;

  group_disp = strip(cohort) || '(*ESC*)nN=' || strip(put(nobs,best.));

  if base_order=1 then do;
    col1=group_disp;
    col2=strip(put(nobs,best.));
  end;
  else do;
    col1=' ';
    col2=' ';
  end;

  col3=base_label;
  col4=max_low;
  col5=max_normal;
  col6=max_high;
  col7=max_total;

  ord1 = cohortn;
  ord2 = base_order;
  blank_after_seq = cohortn;

  label col1='Group'
        col2='Nobs'
        col3='Baseline'
        col4='Low'
        col5='Normal'
        col6='High'
        col7='Total';
run;

proc sort data=table_rows;
  by param ord1 ord2;
run;

data final2output final2qc;
  set table_rows;
  by param;
  length col0 byvar $200;
  retain page1 0;
  if first.param then page1+1;
  col0 = strip(param);
  byvar = strip(param);
  output final2output;
  output final2qc;
run;

%istartv2(SUFFIX=&suffix.);

%m_u_report(
    table=final2output
  , lenlist=24#8#12#12#12#12#12
  , justlist=l#c#l#c#c#c#c
  , justlist_header=l#c#l#c#c#c#c
  , nolblist=N#N#N#N#N#N#N
  , orderlist=Y#N#N#N#N#N#N
  , idlist=Y#Y#Y
  , idpage=N#N#N#N#N#N#N
  , defcol=col1 col2 col3 ("Maximum on-treatment value" col4 col5 col6 col7)
  , blank_after=blank_after_seq
  , pg=999
  , pgvar=page1
);

%istopv2();

data tlf.t_14_3_7_1_6_&suffix.;
  set final2qc;
run;