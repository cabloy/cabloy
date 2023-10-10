const <%=argv.atomClassName%> = require('./atomClass/<%=argv.atomClassName%>.js');

module.exports = app => {
  const atomClasses = {
    <%=argv.atomClassName%>: <%=argv.atomClassName%>(app),
  };
  return atomClasses;
};
