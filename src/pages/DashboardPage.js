import React from "react";
import adminLayout from "../hoc/adminLayout"
import axios from 'axios';

class DashboardPage extends React.Component {
    state = {
      data: null,
      loading: false
    };
    
    

    render(){
      const { data, loading } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

        return <>
            <div className="row">

      </div>
        </>
    }
}

export default adminLayout(DashboardPage);