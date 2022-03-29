using { dalrae.cap.demo.extend as schema } from '../db/schema';
using { NorthWind as external } from './external/NorthWind.csn';

service CatalogService @(path: '/catalogextend'){

    @cds.persistence :{
        table,
        skip : false
    }
    @cds.autoexpose
    entity Employees as projection on external.Employees {
       key EmployeeID, 
           FirstName, 
           LastName, 
           Title, 
           City as BaseCity, 
            '' as MiddleName : String(15),
            '' as PhoneNumber : String(10)
    }   
}


