namespace dalrae.cap.demo.extend;

using { NorthWind as external } from '../srv/external/NorthWind.csn';
 
  entity EmployeesAtr {
    key EmployeeID  : Association to one external.Employees;
        MiddleName  : String; 
        PhoneNumber : String; 
  }

