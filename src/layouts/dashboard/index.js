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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useEffect, useState } from "react";
import {getDoc,doc,getDocs,collection} from "firebase/firestore";
import classesTableData from "layouts/tables/data/classesTableData";
import DataTable from "examples/Tables/DataTable";
import db from "../../firebase-config";

function Dashboard() {
  const [columns,setColumns]=useState([]);
  const [rows,setRows]=useState([]);
  const { sales, tasks } = reportsLineChartData;
  const [myKpi,setMyKpi] = useState({
    presence:0,
    happy:0,
    sad:0,
    angry:0,
  });

  const getKpi=async () =>{
    const mydata=(await getDoc(doc(db,"filiaire","Miola"))).data();
    console.log(mydata);
    const happyPercentage=(mydata.happy)/(mydata.happy+mydata.sad+mydata.angry);
    const sadPercentage=(mydata.sad)/(mydata.happy+mydata.sad+mydata.angry);
    const angryPercentage=(mydata.angry)/(mydata.happy+mydata.sad+mydata.angry);
    const presencePercentage=(mydata.presence)/(mydata.total);
  
    setMyKpi({
      presence:(presencePercentage*100).toFixed(2),
      happy:(happyPercentage*100).toFixed(2),
      sad:(sadPercentage*100).toFixed(2),
      angry:(angryPercentage*100).toFixed(2),
    });

   
  };
  const getClasses=async() => {
    const mydata=(await getDocs(collection(db,"filiaire","Miola","classes"))).docs;
    let myClassesList=[];
    mydata.forEach(element => {
      myClassesList.push(element.data());
      
    });
    const {thecolumns,therows} = classesTableData(myClassesList);
    setColumns(thecolumns);
    setRows(therows);
   


  };
  useEffect(() => {
    getKpi();
    getClasses();
  },[]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="leaderboard"
                title="Presence Percentage"
                count={myKpi? myKpi.presence+"%": 0+"%"}
          
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
               color="dark"
                icon="leaderboard"
                title="Sad Percentage"
                count={myKpi? myKpi.sad+"%": 0+"%"}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="leaderboard"
                title="Happy Percentage"
                count={myKpi? myKpi.happy+"%": 0+"%"}
              
             
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="leaderboard"
                title="Angry Percentage"
            
                count={myKpi? myKpi.angry+"%": 0+"%"}
          
              />
            </MDBox>
          </Grid>
        </Grid>
   
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              {columns!=[] && rows!=[] ?
             <DataTable
             table={{columns, rows}}
             isSorted={false}
             entriesPerPage={false}
             showTotalEntries={false}
             noEndBorder
           /> 
            :
            <p>Loading</p>
            
            }
            
            </Grid>
  
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
