export interface LaunchTask {
  id: string;
  title: string;
  department: 'Marketing' | 'Sales' | 'Legal' | 'Engineering';
  status: 'Pending' | 'Approved';
}

