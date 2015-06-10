import React from "react";
import "./Home.css";
import Filter from "../components/Filter/Filter.es6";
import Schedule from "../components/Schedule/Schedule.es6";
import classNames from "classnames";

export default React.createClass({
  displayName: "Home",

  getInitialState () {
    return {
      inScheduleArea: "before",
      scheduleHeight: 0,
      filterHeight: 0,
      sessionClass: false
    };
  },

  componentDidMount(){
   
    var { inScheduleArea } = this.state;
    var { _setInScheduleArea, _setScheduleHeight, _setFilterHeight } = this;

   
    var top = this.refs.main.getDOMNode().offsetTop;

    // 這裏有點神秘
    var scheduleHeight = this.refs.schedule.getDOMNode().offsetHeight;
    var filterHeight = this.refs.filter.getDOMNode().offsetHeight;
    var height = scheduleHeight - window.innerHeight + filterHeight;
    //console.log("height: "+height);

    _setScheduleHeight(height);
    _setFilterHeight(filterHeight);
    //

    addEventListener("scroll", function() {
        //console.log("->"+pageYOffset)
        
        if(pageYOffset > top && pageYOffset < height){
            _setInScheduleArea("within");
        }
        if(pageYOffset < top){
            _setInScheduleArea("before");
        }
        if(pageYOffset > height){
            _setInScheduleArea("passed");
        }
    });

  },

  _setInScheduleArea(value){
    //console.log("[current] "+this.state.inScheduleArea + " // [to be set] "+ value)
    if(this.state.inScheduleArea !== value){
      //console.log("! set schedule value !")
      this.setState({
        inScheduleArea: value
      })
    }
    
  },
  _setScheduleHeight(value){
    this.setState({
        scheduleHeight: value
    })
  },
  _setFilterHeight(value){
    this.setState({
        filterHeight: value
    })
  },
  _toggleSession(){
    
    this.setState({
        showSession: !this.state.showSession
    })
  },

  render() {
    var {inScheduleArea, scheduleHeight, filterHeight, showSession} = this.state;
    var filterClass = classNames({
        "Home-filter": true,
        "is-fixed": inScheduleArea === "within"
    });

    var filterStyle = {};
    var sessionStyle = {};
    if(inScheduleArea === "passed"){
        filterStyle = { 
          position: "absolute", 
          top: (scheduleHeight - filterHeight - 20) + "px"
        }
        sessionStyle = { 
          position: "absolute", 
          top: (scheduleHeight - filterHeight - 20) + "px"
        }
    }

    var scheduleClass = classNames({
        "Home-schedule" : true,
        "is-fixed" : inScheduleArea !== "before",
        "with-session" : showSession
    });

    var sessionClass = classNames({
        "Home-session" : true,
        "is-show" : showSession,
        "is-fixed" : inScheduleArea === "within"
    })

    var coverIMG = require("./images/cover.jpg");
    return (
      <div>
        <div className="Home-cover">
            <img src={coverIMG} />
        </div>

        <div className="Home-main" ref="main">
          
            <div className={filterClass}
                 style={filterStyle}>
                <Filter ref="filter"
                        sessionHandler={this._toggleSession}
                        showSession={showSession}/>
            </div>
  
            <div className={scheduleClass} ref="schedule">
              <Schedule inScheduleArea={inScheduleArea}
                        sessionHandler={this._toggleSession}
                        showSession={showSession}/>
            </div>
  
            <div className={sessionClass}
                 style={sessionStyle}>detail</div>
          
            <div className="Home-footer"></div>

        </div>
      </div>
    );
  }
});