import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
//import { connect } from 'react-redux';
import LoginComponent from './component/Login';
import AdminHome from './component/Admin/AdminHome';
import SchoolSetup from './component/Admin/Masters/SchoolSetup/SchoolSetup';
import SchoolSetupList from './component/Admin/Masters/SchoolSetup/SchoolSetupList';
import BranchSetup from './component/Admin/Masters/BranchSetup/BranchSetup';
import BranchSetupList from './component/Admin/Masters/BranchSetup/BranchSetupList';
import StateMaster from './component/Admin/Masters/StateMaster/StateMaster';
import CityMaster from './component/Admin/Masters/CityMaster/CityMaster';
import DesignationMaster from './component/Admin/Masters/DesignationMaster/DesignationMaster';
import ReligionMaster from './component/Admin/Masters/ReligionMaster/ReligionMaster';
import TeacherMaster from './component/Admin/Teachers/TeacherMaster/TeacherMaster';
import ParentMaster from './component/Admin/Parents/ParentMaster/ParentMaster';
import ClassMaster from './component/Admin/Masters/ClassMaster/ClassMaster';
import StudentMaster from './component/Admin/Students/StudentMaster/StudentMaster';
import FeeTypeMaster from './component/Admin/Accounts/FeeType/FeeTypeMaster';
import FeeSetupMaster from './component/Admin/Accounts/FeeSetup/FeeSetupMaster';
import StudentChargeMaster from './component/Admin/Accounts/StudentCharge/StudentChargeMaster';
import SendSMSMaster from './component/Admin/SendSMS/SendSMSMaster';

class App extends Component {

render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={AdminHome}/>
          <Route path='/AdminHome/:id' component={AdminHome}/>
          <Route path='/Login' component={LoginComponent}/> 
          <Route path='/SchoolSetup/:id' component={SchoolSetup}/>
          <Route path='/SchoolSetupList' component={SchoolSetupList}/>
          <Route path='/BranchSetup/:id' component={BranchSetup}/>
          <Route path='/BranchSetupList' component={BranchSetupList}/>
          <Route path='/StateMaster/:id' component={StateMaster}/>
          <Route path='/CityMaster/:id' component={CityMaster}/>
          <Route path='/DesignationMaster/:id' component={DesignationMaster}/>
          <Route path='/ReligionMaster/:id' component={ReligionMaster}/>
          <Route path='/TeacherMaster/:id' component={TeacherMaster}/>
          <Route path='/ParentMaster/:id' component={ParentMaster}/>
          <Route path='/ClassMaster/:id' component={ClassMaster}/>
          <Route path='/StudentMaster/:id' component={StudentMaster}/>
          <Route path='/FeeTypeMaster/:id' component={FeeTypeMaster}/>
          <Route path='/FeeSetupMaster/:id' component={FeeSetupMaster}/>
          <Route path='/StudentChargeMaster/:id' component={StudentChargeMaster}/>
          <Route path='/SendSMS/:id' component={SendSMSMaster}/>
        </Switch>
      </div>
       
    );
  }
}

//  function mapStateToProps(state) {
//     return ({
//       isLogin: state.loginReducer.isLogin
//     });
//   }

//export default connect(mapStateToProps)(App);

export default App;

(function getSession(){

    //console.log(sessionStorage.getItem("x-token"));
    if(sessionStorage.getItem("x-token") != null){
      axios.defaults.headers.common['x-token'] = sessionStorage.getItem("x-token");
    }

})();

