const cds = require('@sap/cds');


module.exports = cds.service.impl(async function() {
  const service = await cds.connect.to('NorthWind');
  const { Employees } = this.entities;
  
  this.on('READ', Employees, async req => {
    const exclude = ['MiddleName', 'PhoneNumber'];
    let [id] = req.params, { from, columns, limit, where, orderBy } = req.query.SELECT;

    if (columns) {
      columns = columns.filter(c => !exclude.includes(c?.ref[0]))
    }
  
    const qry = service.tx(req).read(from)

    if (columns) qry.columns(columns);
    if (where) qry.where(where);
    if (limit) qry.limit(limit);
    if (orderBy) qry.orderBy(orderBy);

    const queryData = await qry;
    const data = queryData instanceof Array ? queryData : [queryData];

    const fromDb = await cds.tx(req).run(
      SELECT.from('EmployeesAtr', ["*"]).where({ EmployeeID_EmployeeID: { in: data.map(d => d.EmployeeID) } })
    );
   
    //create a map by employee ID so we can read the array by index instead of searching
    const dbMap = fromDb.reduce((acc, v) => (acc[v.EmployeeID_EmployeeID] = v) && acc, {})
    
    //combine the data
    return data.map(d => ({...d, ...dbMap[d.EmployeeID]}))
   
  });
  

//   const results = await service.tx(req).send({
//     query : qry
//   })

//   let employees = []
//   if (Array.isArray(results)){
//     employees = results
//   }else {employees[0] = results }

//   const getExtensionData = employees.map(async (item) => {
//     const data = await SELECT.from('EmployeesAtr').where({ EmployeeID_EmployeeID: item.EmployeeID })
//     if (data[0]) {
//         item.MiddleName  = data[0].MiddleName
//         item.PhoneNumber = data[0].PhoneNumber
//     } else {
//         item.MiddleName  = null
//         item.PhoneNumber = null
//     }
//     return item
// })
// const employeesWithExtension = await Promise.all(getExtensionData)
//   return employeesWithExtension
// })
});