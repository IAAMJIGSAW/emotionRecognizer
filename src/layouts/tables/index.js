/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import studentsTableData from "layouts/tables/data/studentsTableData";
import axios from "axios";
import {useEffect,useState} from "react"
import { Button,CircularProgress } from "@mui/material";
import db from "../../firebase-config";
import { collection, query, where, getDocs,getDoc,setDoc ,doc,updateDoc ,arrayUnion,FieldValue,onSnapshot,increment,serverTimestamp} from "firebase/firestore";




function Tables() {

  const [columns,setColumns] =useState([]);
  const [rows,setRows] =useState([]);
  const [studentsColumns,setStudentsColumns] =useState([]);
  const [studentsRows,setStudentsRows] =useState([]);
  const [loading,setLoading] =useState(false);
  const [allStudents,setAllStudents]=useState([]);
  const [classdata,setclassdata] = useState([]);
  const isAbsent=(name,data) => {
    let response=true;
    data.map((person)=> {
      if(person.name==name)
      {
      response=false;
      }

    })
    return response;

  };
  const getEmotion=(name,data) => {
    let response="";
    data.map((person)=> {
      if(person.name==name)
      {
      response=person.emotion;
      }

    })
    return response;

  };
  const setClassDocument=async (myclassdata) => 
    {
      let myfirstjson={
        classnumber:1,
        absencenumber:0,
        absencepercentage:0.0,

      
      }
    let mysecondjson={
      happy:0,
      sad:0,
      angry:0,
      presence:0,
      total:0,
    };
    const classnumber=(await getDoc(doc(db,"filiaire","Miola"))).data().classnumber;
     myfirstjson.classnumber=classnumber;
    let totalStudents=0;
    let totalAbsence=0;
    myclassdata.map(student => {
        totalStudents++;
        mysecondjson.total++;
        if(student.isAbsent)
        {
          totalAbsence++;
        }
        else
        {
          mysecondjson.presence++;
        }
          if(mysecondjson[student.emotion]!=null)
          mysecondjson[student.emotion]++;
    
     

    });
    myfirstjson.absencepercentage=(totalAbsence/totalAbsence).toFixed(2);
    myfirstjson.absencenumber=totalAbsence;
   

  await updateDoc(doc(db,"filiaire","Miola"), {
    classnumber: increment(1),
    happy:increment(mysecondjson.happy),
    sad:increment(mysecondjson.sad),
    angry:increment(mysecondjson.angry),
    presence:increment(mysecondjson.presence),
    total:increment(mysecondjson.total),
   })
   console.log("classe number :");
   console.log(myfirstjson.classnumber);
   const classnumbertostring=myfirstjson.classnumber.toString();
   await setDoc(doc(db,"filiaire","Miola","classes",classnumbertostring),{
    classnumber: myfirstjson.classnumber,
    date: serverTimestamp(),
    absencenumber: myfirstjson.absencenumber,
    absencepercentage: myfirstjson.absencepercentage,
  });







      
    }
  const startMlProcess= async () => {
    setclassdata((old) => []);
    let myclassdata=[];
    setLoading(true);
 
    const response=await axios.get("http://127.0.0.1:5000/").catch(e => setLoading(false));

    const data=response.data;
    //const data=await response.json();

 
    allStudents.map((person)=>{
      let myperson={};
      myperson.name=person.name;
      myperson.email=person.email;
      myperson.id=person.id;
      if(isAbsent(person.name,data.people))
      {
        myperson.isAbsent=true;
        myperson.emotion="";
      }
      else
      {
      myperson.emotion=getEmotion(person.name,data.people);
      myperson.isAbsent=false;
      }
      myclassdata.push(myperson);
      

    });




    const {thecolumns,therows} = authorsTableData(myclassdata);

    setColumns(thecolumns);
    setRows(therows);

 
    myclassdata.map(async(student)=> {
      await addEmotionAbsence({student});
    });
    await setClassDocument(myclassdata);
    setLoading(false);
  
  };
  const addEmotionAbsence= async({student}) =>
  {
    const studentRef = doc(db,"filiaire","Miola","etudiants",student.name);
    let myStudentDataEmotion=(await getDoc(studentRef)).data().emotion;
    myStudentDataEmotion[student.emotion]=parseInt(myStudentDataEmotion[student.emotion])+1;
     await updateDoc(studentRef, {
    emotion: {
      happy:myStudentDataEmotion.happy,
      sad:myStudentDataEmotion.sad,
      neutral:myStudentDataEmotion.neutral,
      angry:myStudentDataEmotion.angry,
    },
   });
   if(student.isAbsent)
   {
     await updateDoc(studentRef, {
      absence: increment(1),
     })

   }
  


}
  const getAllStudents=async () => {

  const myCollection = collection(db,"filiaire","Miola","etudiants");
  const q = query(collection(db,"filiaire","Miola","etudiants"));

  // const data=await getDocs(myCollection);
  // console.log("new data");
  // console.log(data);

  // //const data=await  db.collection("filiaire").doc("Miola").get().collection("etudiants").getDocs();

  // const students=[];
  // data.forEach((doc) => students.push(doc.data()));
  // setAllStudents(students);
  // const {thecolumns,therows} = studentsTableData(students);
  // setStudentsColumns(thecolumns);
  // setStudentsRows(therows);

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const students=[];
    snapshot.forEach((doc) => {
      students.push(doc.data())
     });
     setAllStudents(students);
     const {thecolumns,therows} = studentsTableData(students);
     setStudentsColumns(thecolumns);
     setStudentsRows(therows);
    // snapshot.docChanges().forEach((change) => {
    //   if (change.type === "added") {
    //       console.log("New city: ", change.doc.data());
    //   }
    //   if (change.type === "modified") {
    //       console.log("Modified city: ", change.doc.data());
    //   }
    //   if (change.type === "removed") {
    //       console.log("Removed city: ", change.doc.data());
    //   }
    // });
  });



  };

  const startProcess= async () => 
  {
    const { thecolumns, therows } = authorsTableData([]);
    setColumns(thecolumns);
    setRows(therows);
    const classData=await startMlProcess();
    // await classData.map(async(student)=> {
    //   await addEmotionAbsence({student});
    // });

  
 
  };

  
  useEffect(()=> {getAllStudents();},[]);


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Presence Table
                </MDTypography>
                {loading ? <CircularProgress /> : <Button variant="contained" onClick={startProcess} color="success">Start Process</Button>} 
              
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
             
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                 Students Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: studentsColumns, rows: studentsRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
