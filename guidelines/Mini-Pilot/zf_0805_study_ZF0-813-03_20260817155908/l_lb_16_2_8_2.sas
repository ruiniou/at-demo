%let suffix=saf;

proc sort data=adam.adsl(keep=usubjid subjid saffl cohort) out=adsl;
  by usubjid;
run;

proc sort data=adam.adlb(where=(parcat1='CHEMISTRY')) out=adlb;
  by usubjid;
run;

data adlb_lst0;
  merge adlb(in=a) adsl(in=b);
  by usubjid;
  if a and b;
  if saffl='Y';

  length col1-col9 $1000 studyday_time dtc tmc anrloc anrhic $100;
  length ord_subjid $200 ord_param $400;

  if missing(cohort) then cohort='Missing';

  col1 = strip(subjid);
  col2 = strip(param);
  col3 = strip(avisit);

  if missing(ady) then studyday_time='';
  else studyday_time = strip(put(ady,best.));
  if anl01fl='Y' and not missing(studyday_time) then studyday_time = cats(studyday_time,'*');

  dtc='';
  tmc='';
  if not missing(adtm) then do;
    dtc = strip(put(datepart(adtm), yymmdd10.));
    tmc = strip(put(timepart(adtm), time8.));
  end;

  if not missing(studyday_time) and not missing(tmc) then col4 = catx('/', studyday_time, tmc);
  else if not missing(studyday_time) then col4 = studyday_time;
  else if not missing(dtc) and not missing(tmc) then col4 = catx('/', dtc, tmc);
  else if not missing(dtc) then col4 = dtc;
  else if not missing(tmc) then col4 = tmc;
  else col4 = '';

  col5 = strip(avalc);
  col6 = strip(lbstresu);

  if missing(anrlo) then anrloc='';
  else anrloc = strip(put(anrlo,best.));
  if missing(anrhi) then anrhic='';
  else anrhic = strip(put(anrhi,best.));

  col7 = anrloc;
  col8 = anrhic;
  col9 = propcase(strip(anrind));

  ord_subjid = strip(subjid);
  ord_param  = strip(param);
  ord_avisitn = avisitn;
  ord_adtm    = adtm;

  keep cohort col1-col9 ord_subjid ord_param ord_avisitn ord_adtm;
run;

proc sort data=adlb_lst0 out=cohort_levels nodupkey;
  by cohort;
run;

data cohort_levels;
  set cohort_levels;
  start = _n_;
  end   = _n_;
  label = cohort;
  fmtname = 'cohort_cat';
  type = 'N';
run;

proc format cntlin=cohort_levels(keep=fmtname start end label type);
run;

proc sort data=adlb_lst0;
  by cohort;
run;

proc sort data=cohort_levels out=cohort_map(keep=cohort start rename=(start=cohortn));
  by cohort;
run;

data adlb_lst;
  merge adlb_lst0(in=a) cohort_map(in=b);
  by cohort;
  if a;
run;

proc sort data=adlb_lst;
  by cohortn ord_subjid ord_param ord_avisitn ord_adtm;
run;

%m_l(
   inds=adlb_lst
  ,pageByN=cohortn
  ,pageByFmt=cohort_cat
  ,varlist=col1#col2#col3#col4#col5#col6#col7#col8#col9
  ,headerlist=Subject identifier#Parameter#Analysis visit#Study day/time of collection#Result#Unit#Reference range lower limit#Reference range upper limit#Reference range indicator
  ,sortBy=ord_subjid#ord_param#ord_avisitn#ord_adtm
  ,lenlist=16#28#18#20#10#10#13#13#12
  ,idcoln=1
  ,orderlist=Y#N#N#N#N#N#N#N#N
  ,idlist=Y#N#N#N#N#N#N#N#N
  ,idpage=N#N#N#N#N#N#N#N#N
  ,jdvarlist=col5#col7#col8
  ,pg=18
  ,pg_byvar=Y
  ,pgvar=
  ,sfx=&suffix.
  ,reportout=Y
  ,deBug=N
);