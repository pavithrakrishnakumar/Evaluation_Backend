import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { AuthService } from 'src/auth/auth.service';

interface FilterOptions {
  designation?: string;
  department?: string;
}
interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) {}

  async addEmployee(employeeData: any): Promise<Employee> {
    const newEmployee = new this.employeeModel(employeeData);
    return newEmployee.save();
  }

  async getAllEmployees(
    filterOptions: FilterOptions = {},
    sortOptions: SortOptions = { field: 'createdAt', order: 'asc' }
  ): Promise<Employee[]> {
    const {  designation, department } = filterOptions;
    const { field, order } = sortOptions;

    const query: any = {};

    if (designation) {
      query.designation = designation;
    }

    if (department) {
      query.department = department;
    }

    return this.employeeModel
      .find(query)
      .sort({ [field]: order })
      .exec();
  }
  async getAllFilters(
    filterOptions: FilterOptions = {},
    sortOptions: SortOptions = { field: 'createdAt', order: 'asc' }
  ): Promise<any> {
    const { field, order } = sortOptions;

    const distinctDepartments:any = await this.employeeModel.distinct('department').exec();
    const distinctDesignations:any = await this.employeeModel.distinct('designation').exec();

    return {
      department: distinctDepartments,
      designation: distinctDesignations,
    };
}
}