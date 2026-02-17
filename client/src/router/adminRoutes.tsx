import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AuthGuard } from '@/components/guards/AuthGuard';

const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const UserListPage = lazy(() => import('@/features/users/pages/UserListPage'));
const UserFormPage = lazy(() => import('@/features/users/pages/UserFormPage'));
const RoleListPage = lazy(() => import('@/features/roles/pages/RoleListPage'));
const RoleFormPage = lazy(() => import('@/features/roles/pages/RoleFormPage'));
const CollegeListPage = lazy(() => import('@/features/colleges/pages/CollegeListPage'));
const CollegeFormPage = lazy(() => import('@/features/colleges/pages/CollegeFormPage'));
const ContentSectionListPage = lazy(() => import('@/features/content-sections/pages/ContentSectionListPage'));
const CourseListPage = lazy(() => import('@/features/courses/pages/CourseListPage'));
const CourseFormPage = lazy(() => import('@/features/courses/pages/CourseFormPage'));
const ExamListPage = lazy(() => import('@/features/exams/pages/ExamListPage'));
const ExamFormPage = lazy(() => import('@/features/exams/pages/ExamFormPage'));
const FormListPage = lazy(() => import('@/features/forms/pages/FormListPage'));
const FormBuilderPage = lazy(() => import('@/features/forms/pages/FormBuilderPage'));
const SubmissionListPage = lazy(() => import('@/features/forms/pages/SubmissionListPage'));
const LeadListPage = lazy(() => import('@/features/leads/pages/LeadListPage'));
const LeadDetailPage = lazy(() => import('@/features/leads/pages/LeadDetailPage'));
const LeadPipelinePage = lazy(() => import('@/features/leads/pages/LeadPipelinePage'));
const ReviewListPage = lazy(() => import('@/features/reviews/pages/ReviewListPage'));
const PageListPage = lazy(() => import('@/features/pages/pages/PageListPage'));
const PageFormPage = lazy(() => import('@/features/pages/pages/PageFormPage'));
const SeoListPage = lazy(() => import('@/features/seo/pages/SeoListPage'));
const SeoFormPage = lazy(() => import('@/features/seo/pages/SeoFormPage'));
const ProfilePage = lazy(() => import('@/features/settings/pages/ProfilePage'));
const ChangePasswordPage = lazy(() => import('@/features/settings/pages/ChangePasswordPage'));

export const adminRoutes: RouteObject = {
  path: 'admin',
  element: <AuthGuard />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'users', element: <UserListPage /> },
        { path: 'users/new', element: <UserFormPage /> },
        { path: 'users/:id/edit', element: <UserFormPage /> },
        { path: 'roles', element: <RoleListPage /> },
        { path: 'roles/new', element: <RoleFormPage /> },
        { path: 'roles/:id/edit', element: <RoleFormPage /> },
        { path: 'colleges', element: <CollegeListPage /> },
        { path: 'colleges/new', element: <CollegeFormPage /> },
        { path: 'colleges/:id/edit', element: <CollegeFormPage /> },
        { path: 'colleges/:collegeId/sections', element: <ContentSectionListPage /> },
        { path: 'courses', element: <CourseListPage /> },
        { path: 'courses/new', element: <CourseFormPage /> },
        { path: 'courses/:id/edit', element: <CourseFormPage /> },
        { path: 'exams', element: <ExamListPage /> },
        { path: 'exams/new', element: <ExamFormPage /> },
        { path: 'exams/:id/edit', element: <ExamFormPage /> },
        { path: 'forms', element: <FormListPage /> },
        { path: 'forms/new', element: <FormBuilderPage /> },
        { path: 'forms/:id/edit', element: <FormBuilderPage /> },
        { path: 'submissions', element: <SubmissionListPage /> },
        { path: 'leads', element: <LeadListPage /> },
        { path: 'leads/pipeline', element: <LeadPipelinePage /> },
        { path: 'leads/:id', element: <LeadDetailPage /> },
        { path: 'reviews', element: <ReviewListPage /> },
        { path: 'pages', element: <PageListPage /> },
        { path: 'pages/new', element: <PageFormPage /> },
        { path: 'pages/:id/edit', element: <PageFormPage /> },
        { path: 'seo', element: <SeoListPage /> },
        { path: 'seo/new', element: <SeoFormPage /> },
        { path: 'seo/:id/edit', element: <SeoFormPage /> },
        { path: 'settings/profile', element: <ProfilePage /> },
        { path: 'settings/password', element: <ChangePasswordPage /> },
      ],
    },
  ],
};
