var RecentChangesTable = React.createClass({
  render: function () {
    return (<div>
             <h3>{this.props.title}</h3>
             <table className='table table-hover'>
               {this.props.children}
             </table>
           </div>);
  }
});

RecentChangesTable.Heading = React.createClass({
  render: function() {
    var headingStyle = { backgroundColor: '#eee',
                         fontSize: '12px',
                         textTransform: 'uppercase'
                       };
    return (<th style={headingStyle}>{this.props.heading}</th>);
  }
});

RecentChangesTable.Row = React.createClass({
  render: function() {
    return (<tr>
              <td>{this.props.changeSet.when}</td>
              <td>{this.props.changeSet.who}</td>
              <td>{this.props.changeSet.description}</td>
            </tr>);
  }
});

RecentChangesTable.Headings = React.createClass({
  render: function() {
    var headings = this.props.headings.map(function(heading, index) {
      return(<RecentChangesTable.Heading heading = {heading} key={index}/>);
    });
    return (<thead><tr>{headings}</tr></thead>);
  }
});


RecentChangesTable.Rows = React.createClass({
  render: function() {
    var rows = this.props.changeSets.map(function (changeSet, index) {
      return (<RecentChangesTable.Row changeSet = {changeSet} key={index}/>);
    });
    return (<tbody>{rows}</tbody>);
  }
});


var App = React.createClass({
  getInitialState: function() {
    return { 
      changeSets: []
    };
  },
  propTypes: {
    headings: React.PropTypes.array,
    changeSets: React.PropTypes.array,
    author: React.PropTypes.string.isRequired
  },
  getDefaultProps: function() {
    return {
      headings: ['When happened', 'Who did it', 'What they change']
    };
  },
  componentDidMount: function() { 
    $.ajax({
      url: 'http://openlibrary.org/recentchanges.json?limit=10',
      context: this,
      dataType: 'json',
      type: 'GET'
    }).done(function (data) {
      var changeSets = this.mapOpenLibraryDataToChangeSet(data);
      this.setState({changeSets: changeSets});
    });
  },
  mapOpenLibraryDataToChangeSet: function (data) {
    return data.map(function (change, index) {
      return {
        "when": moment.tz(change.timestamp, "UTC").clone().tz(moment.tz.guess()).fromNow(),
        "who": change.author.key,
        "description": change.comment
      };
    });
  },
  render: function() {
    return (<RecentChangesTable title={this.props.title}>
             <RecentChangesTable.Headings headings = {this.props.headings}/>
             <RecentChangesTable.Rows changeSets = {this.state.changeSets}/>
           </RecentChangesTable>);
    }
});


var headings = ['When', 'Who', 'Description'];
var props = { headings: headings, author: "PW"};

ReactDOM.render(<App {...props} />, document.getElementById('container'));



