import type { CollegeStatus, CollegeType } from '@/config/constants';
import type { Course } from './course';
import type { Exam } from './exam';

export interface College {
  _id: string;
  id: string;
  name: string;
  slug: string;
  type: CollegeType;
  description: string;
  logo: string;
  coverImage: string;
  location: CollegeLocation;
  courses: Course[] | string[];
  exams: Exam[] | string[];
  fees: CollegeFees;
  ranking: number | null;
  established: number | null;
  website: string;
  accreditation: string;
  affiliation: string;
  facilities: string[];
  status: CollegeStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollegeLocation {
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
}

export interface CollegeFees {
  min: number;
  max: number;
  currency: string;
}

export interface CreateCollegeRequest {
  name: string;
  type: CollegeType;
  description?: string;
  logo?: string;
  coverImage?: string;
  location?: Partial<Omit<CollegeLocation, 'coordinates'>>;
  fees?: Partial<CollegeFees>;
  ranking?: number | null;
  established?: number | null;
  website?: string;
  accreditation?: string;
  affiliation?: string;
  facilities?: string[];
}

export interface UpdateCollegeRequest extends Partial<CreateCollegeRequest> {
  status?: CollegeStatus;
}

export interface PublishCollegeRequest {
  status: 'published' | 'draft' | 'archived';
}

export interface ManageCoursesRequest {
  courses: string[];
}

export interface ManageExamsRequest {
  exams: string[];
}
