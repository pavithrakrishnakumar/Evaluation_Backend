import { Controller, Post, Get, Body, UseGuards, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetAllEmployeesDto } from './dto/get-all-employee.dto';


@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('add')
  async addEmployee(
    @Body() body: { name: string; status: string; designation: string; department: string; role: string },
  ) {
    return this.employeeService.addEmployee(body);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllEmployees(
    @Query() query: GetAllEmployeesDto, 
  ) {
    return this.employeeService.getAllEmployees(query);
  }

  @Get('allfilter')
  @UseGuards(JwtAuthGuard)
  async getAllFilters(
    @Query() query: GetAllEmployeesDto, 
  ) {
    return this.employeeService.getAllFilters(query);
  }
}
