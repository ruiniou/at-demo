%let suffix=saf;

proc format;
  value cohort_cat
    1 = "Biliary Tract Cancer"
    2 = "Colorectal Cancer"
    3 = "Cervical Cancer"
    4 = "Endometrial Cancer"
    5 = "Ovarian Cancer"
    6 = "Non-Small-Cell Lung Cancer"
    7 = "Other"
  ;
run;

proc sort data=adam.adsl(keep=usubjid subjid saffl cohort cohortn agesexra) out=adsl;
  by usubjid;
run;

proc sort data=adam.adae(
    keep=usubjid aeterm aedecod grpterm meddrav stwsdy aphase doseon doseu stwsildy
         atoxgr aacnsd01 aeser aoutsd01 aecontrt aae016fl ildadrel trtemfl aae015fl
         astdt astdy
    where=(trtemfl='Y' and aae015fl='Y')
  ) out=adae;
  by usubjid astdt astdy grpterm aedecod aeterm;
run;

data final_listing;
  length col1-col14 $1000;
  merge adae(in=a) adsl(in=b where=(saffl='Y'));
  by usubjid;
  if a and b;

  pageby = cohortn;

  ord1 = pageby;
  ord2 = subjid;
  ord3 = astdy;
  ord4 = astdt;
  ord5 = grpterm;
  ord6 = aedecod;
  ord7 = aeterm;

  col1 = strip(subjid);
  col2 = strip(agesexra);
  col3 = strip(aeterm);

  if not missing(grpterm) and not missing(aedecod) then
    col4 = catx('/', strip(grpterm), strip(aedecod));
  else if not missing(grpterm) then
    col4 = strip(grpterm);
  else col4 = strip(aedecod);

  if missing(stwsdy) and missing(aphase) then col5 = '';
  else if missing(stwsdy) then col5 = strip(aphase);
  else if missing(aphase) then col5 = strip(put(stwsdy,best.));
  else col5 = cats(strip(put(stwsdy,best.)),'/',strip(aphase));

  if missing(doseon) then col6 = '';
  else if missing(doseu) then col6 = strip(put(doseon,best.));
  else col6 = cats(strip(put(doseon,best.)),' ',strip(doseu));

  if missing(stwsildy) then col7 = '';
  else col7 = strip(put(stwsildy,best.));

  col8 = strip(atoxgr);
  col9 = strip(aacnsd01);
  col10 = strip(aeser);

  select (strip(aoutsd01));
    when ('RECOVRD') col11 = 'Recovered/ Resolved';
    when ('RECVRNG') col11 = 'Recovering / Resolving';
    when ('RWS')     col11 = 'Recovered / Resolved with sequelae';
    when ('NRNR')    col11 = 'Not recovered/ Not resolved';
    when ('Fa')      col11 = 'Fatal';
    otherwise        col11 = strip(aoutsd01);
  end;

  col12 = strip(aecontrt);
  col13 = strip(aae016fl);
  col14 = strip(ildadrel);
run;

proc sort data=final_listing;
  by ord1 ord2 ord3 ord4 ord5 ord6 ord7;
run;

%m_l(
  inds=final_listing
  ,pop_flag=
  ,whr=
  ,pageByN=pageby
  ,pageByFmt=cohort_cat
  ,varlist=
      col1#col2#col3#col4#col5#col6#col7#col8#col9#col10#col11#col12#col13#col14
  ,headerlist=
      Subject identifier
      #Age/Sex/Race
      #Event term <verbatim> as reported by the investigator
      #AESI Group/@Subgroup/@Preferred term [a]@(MedDRA version nn.n)
      #First treatment to AE onset/worsening (days) /@Analysis phase
      #Dose of first T-DXd at time of AE
      #Latest treatment to AE onset/worsening (days) [b]
      #Maximum CTCAE grade
      #Action taken with T-DXd [c]
      #Serious adverse event?
      #Outcome [d]
      #Concomitant or additional treatment give
      #AE possibly related to T-DXd [e]
      #Adjudicated ILD Related to any study drug
  ,sortBy=ord1#ord2#ord3#ord4#ord5#ord6#ord7
  ,defcol=
  ,lenlist=14#14#20#24#18#16#14#10#12#10#16#12#12#14
  ,idcoln=4
  ,orderlist=Y#Y#Y#Y#N#N#N#N#N#N#N#N#N#N
  ,idlist=Y#Y#Y#Y#N#N#N#N#N#N#N#N#N#N
  ,idpage=N#N#N#N#N#N#N#N#Y#N#N#N#N#N
  ,jdvarlist=
  ,pg=12
  ,pg_byvar=N
  ,pgvar=
  ,sfx=&suffix.
  ,reportout=Y
  ,deBug=N
);