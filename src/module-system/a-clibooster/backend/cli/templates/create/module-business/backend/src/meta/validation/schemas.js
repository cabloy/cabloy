const <%=argv.atomClassName%> = require('./schema/<%=argv.atomClassName%>.js');


  const schemas = {};
  // <%=argv.atomClassName%>
  Object.assign(schemas, <%=argv.atomClassName%>);
  // ok
   module.exports = schemas;
