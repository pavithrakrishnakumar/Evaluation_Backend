import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { AuthService } from 'src/auth/auth.service';

interface FilterOptions {
  designation?: string;
  department?: string;
  name?: string;
  page?:string
}
interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}
interface PaginationData {
  total: number;
  limit: number;
  currentPage: number;
}

interface AllEmployeeResponse {
  paginationData: PaginationData;
  employeeData: Employee[]; // or the correct type for employee documents
}

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) {}

  async addEmployee(employeeData: any): Promise<Employee> {
    try {
      const newEmployee = new this.employeeModel(employeeData);
      return newEmployee.save();
    } catch (Error) {
      throw new BadRequestException(Error.message);
    }
  }

  async getAllEmployees(
    filterOptions: FilterOptions = {},
    sortOptions: SortOptions = { field: 'createdAt', order: 'asc' }
  ): Promise<any> {
    try {
      const {  designation, department, name, page='1' } = filterOptions;
      const { field, order } = sortOptions;

      const query: any = {};

      if (designation) {
        query.designation = designation;
      }

      if (department) {
        query.department = department;
      }

      if (name) {
        query.name = new RegExp(name, 'i') 
      }


    const limit = 8;
    const skip = (Number(page) - 1) * limit;

    const totalCount = await this.employeeModel.countDocuments(query);
    const employeeData = await this.employeeModel
      .find(query)
      .sort({ [field]: order }) // Sort by the dynamic field and order
      .skip(skip) // Skip documents for pagination
      .limit(limit) // Limit the number of results to 10
      .exec();

      return {
        paginationData: {
          total: totalCount,
          limit,
          currentPage: Number(page),
          numOfPages: Math.ceil(totalCount/limit)
        },
        employeeData,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllFilters(
  ): Promise<any> {
    try {
      const distinctDepartments:any = await this.employeeModel.distinct('department').exec();
      const distinctDesignations:any = await this.employeeModel.distinct('designation').exec();
      
      return {
        department: distinctDepartments,
        designation: distinctDesignations,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
}
}