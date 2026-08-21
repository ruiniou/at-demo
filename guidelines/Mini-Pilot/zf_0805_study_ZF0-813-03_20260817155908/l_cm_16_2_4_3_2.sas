%let suffix=fas;

proc sort data=adam.adsl(keep=usubjid subjid cohort fasfl) out=adsl;
    by usubjid;
run;

proc sort data=adam.adcm out=adcm;
    by usubjid;
run;

proc sql noprint;
    select distinct strip(whodrgv)
      into :whodrgv trimmed
      from adam.adcm
     where cmcat = 'CANCER THERAPY'
       and module in ('CAPRX','CAPRXR')
       and not missing(whodrgv);
quit;

%if %superq(whodrgv)= %then %do;
    %let whodrgv=mm yyyy;
%end;

proc sql;
    create table final0 as
    select a.usubjid,
           b.subjid,
           b.cohort,
           a.cmdecod,
           a.aphase,
           a.prsystem,
           a.cmtrt,
           a.regno,
           a.cmroute,
           a.cmclas,
           a.cxtrtst,
           a.cmdose,
           a.astdt,
           a.astdy,
           a.astdtf,
           a.aendt,
           a.aendy,
           a.aendtf,
           a.oncrsr,
           a.failreas,
           a.cxcherad
    from adcm as a
         inner join adsl as b
            on a.usubjid = b.usubjid
    where b.fasfl = 'Y'
      and a.cmcat = 'CANCER THERAPY'
      and a.module in ('CAPRX','CAPRXR');
quit;

proc sort data=final0;
    by cohort subjid astdt aendt cmdecod;
run;

data cohort_fmt;
    set final0(keep=cohort where=(not missing(cohort)));
    by cohort;
    if first.cohort;
    cohortn + 1;
run;

proc sql;
    create table final0b as
    select a.*, b.cohortn
    from final0 as a
         left join cohort_fmt as b
           on a.cohort = b.cohort;
quit;

data _null_;
    set cohort_fmt end=eof;
    if _n_=1 then call execute('proc format; value cohortpg');
    call execute(cats(strip(put(cohortn,best.)),' = ''',tranwrd(strip(cohort),"'","''"),"'"));
    if eof then call execute('; run;');
run;

data final;
    length col1-col15 $1000;
    set final0b;
    by cohort subjid astdt aendt cmdecod;

    length startdtc enddtc astday aenday $200;

    if not missing(astdt) then startdtc = strip(put(astdt, yymmdd10.));
    else startdtc = '';

    if not missing(astdy) then do;
        astday = strip(put(astdy, best.));
        if not missing(astdtf) then astday = strip(astday) || '*';
        if not missing(startdtc) then col11 = strip(startdtc) || ' (' || strip(astday) || ')';
        else col11 = '(' || strip(astday) || ')';
    end;
    else if not missing(startdtc) then col11 = strip(startdtc);
    else col11 = '';

    if not missing(aendt) then enddtc = strip(put(aendt, yymmdd10.));
    else enddtc = '';

    if not missing(aendy) then do;
        aenday = strip(put(aendy, best.));
        if not missing(aendtf) then aenday = strip(aenday) || '*';
        if not missing(enddtc) then col12 = strip(enddtc) || ' (' || strip(aenday) || ')';
        else col12 = '(' || strip(aenday) || ')';
    end;
    else if not missing(enddtc) then col12 = strip(enddtc);
    else col12 = '';

    col1  = strip(subjid);
    col2  = strip(cmdecod);
    col3  = strip(aphase);
    col4  = strip(prsystem);
    col5  = strip(cmtrt);
    col6  = strip(regno);
    col7  = strip(cmroute);
    col8  = strip(cmclas);
    col9  = strip(cxtrtst);
    if not missing(cmdose) then col10 = strip(put(cmdose, best.));
    else col10 = '';
    col13 = strip(oncrsr);
    col14 = strip(failreas);
    col15 = strip(cxcherad);

    order_subjid = subjid;
    order_astdt = astdt;
    order_aendt = aendt;
    order_cmdecod = cmdecod;
run;

%m_l(
    inds=final
   ,whr=not missing(cohortn)
   ,pageByN=cohortn
   ,pageByFmt=cohortpg.
   ,varlist=col1#col2#col3#col4#col5#col6#col7#col8#col9#col10#col11#col12#col13#col14#col15
   ,headerlist=Subject identifier#Generic drug name@(WHODrug Global &whodrgv.)#Analysis phase [a]#Number of prior regimens#Agent#Regimen number#Route of administration#Therapy class#Treatment status#Total number of cycles administered#Start date (YYYY-MM-DD)@(Study day at start)#End date (YYYY-MM-DD)@(Study day at end)#Best response#Reason for therapy failure#Concomitant chemoradiotherapy
   ,sortBy=cohortn#order_subjid#order_astdt#order_aendt#order_cmdecod
   ,lenlist=14#22#14#12#14#10#14#14#14#12#18#18#12#16#12
   ,idcoln=2
   ,orderlist=Y#Y#N#N#N#N#N#N#N#N#N#N#N#N#N
   ,idlist=Y#Y#N#N#N#N#N#N#N#N#N#N#N#N#N
   ,idpage=N#N#N#N#N#N#N#N#Y#N#N#N#N#N#N
   ,pg=12
   ,pg_byvar=N
   ,sfx=&suffix.
   ,reportout=Y
   ,deBug=N
);