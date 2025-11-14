/\*\*

- USERS ENDPOINTS INTEGRATION SUMMARY
-
- This document outlines the new Users API integration for admin management.
- All endpoints are protected and require Bearer token authentication.
  \*/

// ============================================================================
// 1. FILES CREATED
// ============================================================================

/\*\*

- /src/types/api/users.ts
- - UserDTO: Backend response shape from API
- - User: UI domain model (mapped from UserDTO)
- - User enums: UserRole (USER, ADMIN), AuthProvider (LOCAL, GOOGLE, GITHUB)
- - Request/Response types: UpdateUserRequest, SearchUsersParams, etc.
- - Mapper functions: mapUserDtoToModel(), mapUserDtosToModels()
    \*/

/\*\*

- /src/services/users.service.ts
- Pure HTTP functions (no React):
- - fetchUsers() - GET /users (all users)
- - fetchUser(id) - GET /users/{id} (single user)
- - fetchCurrentUser() - GET /users/me (current authenticated user)
- - searchUsers(params) - GET /users/search?q=...
- - updateUser(id, data) - PUT /users/{id}
- - deleteUser(id) - DELETE /users/{id}
    \*/

/\*\*

- /src/hooks/api/useUsers.ts
- Query hooks (read-only):
- - useUsers() - Fetch all users with React Query
- - useUser(id) - Fetch single user with React Query
- - useCurrentUser() - Fetch current user (with higher staleTime)
- - useSearchUsers(params) - Search users with debounce support
    \*/

/\*\*

- /src/hooks/api/useUserMutations.ts
- Mutation hooks (write operations):
- - useUpdateUser() - Update user with optimistic cache update
- - useDeleteUser() - Delete user with cache invalidation
    \*/

/\*\*

- Updated files:
- - /src/lib/api/config.ts - Added API_PATHS.USERS endpoints
- - /src/lib/query-keys.ts - Added userKeys factory and getUserInvalidationKeys()
    \*/

// ============================================================================
// 2. WHERE TO USE (INTEGRATION POINTS)
// ============================================================================

/\*\*

- ADMIN USER MANAGEMENT PAGE (Priority: HIGH)
- Location: /src/app/(root)/users/admin/page.tsx (needs creation)
-
- This page should:
- 1.  List all users with pagination/search
- 2.  Show user roles (USER, ADMIN), status (verified), provider
- 3.  Allow bulk actions: edit role, delete user
- 4.  Search users by name/email
- 5.  View user details (created by, updated by, timestamps)
-
- Usage:
- const { data: users, isPending } = useUsers();
- const { mutate: updateUser } = useUpdateUser();
- const { mutate: deleteUser } = useDeleteUser();
- const { data: searchResults } = useSearchUsers({ q: searchTerm });
  \*/

/\*\*

- USER PROFILE PAGE (Priority: HIGH)
- Location: /src/app/(root)/profile/page.tsx (needs creation)
-
- This page should:
- 1.  Display current user info (name, email, avatar, role)
- 2.  Allow editing name, email, profile image
- 3.  Show account provider (LOCAL, GOOGLE, etc.)
- 4.  Show timestamps (created date, last updated)
- 5.  Email verification status
-
- Usage:
- const { data: currentUser, isPending } = useCurrentUser();
- const { mutate: updateUser } = useUpdateUser();
-
- // Update profile
- updateUser({
-     id: currentUser.id,
-     data: { name, email, imageUrl }
- });
  \*/

/\*\*

- APP HEADER/NAVBAR (Priority: HIGH)
- Location: /src/components/dashboard/app-header.tsx
-
- Integration points:
- 1.  Display current user name/email in header dropdown
- 2.  Show user avatar/initials
- 3.  Link to profile page
- 4.  Link to admin users page (if user role is ADMIN)
- 5.  Logout button already exists
-
- Usage:
- const { data: currentUser } = useCurrentUser();
-
- return (
-     <DropdownMenu>
-       <span>{currentUser?.name}</span>
-       <img src={currentUser?.imageUrl} />
-       <Link href="/profile">Profile</Link>
-       {currentUser?.role === 'ADMIN' && (
-         <Link href="/users/admin">Manage Users</Link>
-       )}
-     </DropdownMenu>
- );
  \*/

/\*\*

- INITIAL APP SETUP / AUTH GUARD (Priority: MEDIUM)
- Location: /src/components/auth/auth-guard.tsx (enhancement)
-           /src/app/layout.tsx (hook integration)
-
- This should:
- 1.  Call useCurrentUser() on app mount
- 2.  Store current user in React Query cache for global access
- 3.  Redirect to login if user fetch fails/401
- 4.  Populate user context for role-based access control
-
- Usage:
- In layout.tsx:
- <AuthGuard>
-     <AdminRoutes />  {/* Check currentUser role */}
- </AuthGuard>
  */

/\*\*

- ADMIN ROLE-BASED ACCESS CONTROL (Priority: MEDIUM)
- Usage pattern:
- const { data: currentUser } = useCurrentUser();
- const isAdmin = currentUser?.role === UserRole.ADMIN;
-
- if (!isAdmin) return <AccessDenied />;
-
- // Show admin features
  \*/

/\*\*

- USER SEARCH/FILTER (Priority: LOW)
- Location: Could be in any admin page that needs to find/mention users
-
- Usage:
- const [searchTerm, setSearchTerm] = useState('');
- const { data: results } = useSearchUsers(
-     { q: searchTerm },
-     searchTerm.length > 0
- );
  \*/

// ============================================================================
// 3. BACKEND RESPONSE HANDLING
// ============================================================================

/\*\*

- Successful responses (200/204):
- - GET /users returns: UserDTO[]
- - GET /users/{id} returns: UserDTO
- - GET /users/me returns: UserDTO
- - GET /users/search returns: UserDTO[]
- - PUT /users/{id} returns: UserDTO
- - DELETE /users/{id} returns: 204 (handled by client.ts)
-
- Error responses:
- - 401: Unauthorized (not logged in)
- - 403: Forbidden (not admin)
- - 404: User not found
- - 400: Bad request (invalid data)
    \*/

// ============================================================================
// 4. QUERY KEY STRUCTURE (for cache invalidation)
// ============================================================================

/\*\*

- userKeys.lists() -> ["users", "list"]
- userKeys.searches() -> ["users", "search"]
- userKeys.details() -> ["users", "detail"]
- userKeys.detail(userId) -> ["users", "detail", userId]
- userKeys.search("john") -> ["users", "search", { query: "john" }]
- userKeys.me() -> ["users", "me"]
-
- Auto-invalidation after mutations:
- - deleteUser(id) invalidates: lists, details, searches, detail(id)
- - updateUser(id) invalidates: lists and updates detail cache
    \*/

// ============================================================================
// 5. PERMISSION MODEL (Backend enforces, Frontend displays)
// ============================================================================

/\*\*

- Public endpoints (anyone):
- - GET /users/me (get own user info)
-
- Admin-only endpoints (check role on frontend):
- - GET /users (list all)
- - GET /users/{id} (view any user)
- - GET /users/search (search any user)
- - PUT /users/{id} (modify any user)
- - DELETE /users/{id} (delete any user)
-
- Frontend should:
- 1.  Check currentUser?.role === 'ADMIN' before showing UI
- 2.  Disable/hide admin buttons for non-admins
- 3.  Backend will reject 403 if user tries direct API calls
      \*/

// ============================================================================
// 6. EXAMPLE USAGE IN COMPONENT
// ============================================================================

/\*\*

- Example: Admin Users Management Page
-
- 'use client';
-
- import { useUsers, useSearchUsers } from '@/hooks/api/useUsers';
- import { useUpdateUser, useDeleteUser } from '@/hooks/api/useUserMutations';
- import { useCurrentUser } from '@/hooks/api/useUsers';
- import { UserRole } from '@/types/api/users';
-
- export function AdminUsersPage() {
- const { data: currentUser } = useCurrentUser();
- const { data: users, isPending } = useUsers();
- const { mutate: updateUser } = useUpdateUser();
- const { mutate: deleteUser } = useDeleteUser();
- const [searchTerm, setSearchTerm] = useState('');
- const { data: searchResults } = useSearchUsers(
-     { q: searchTerm },
-     searchTerm.length > 0
- );
-
- // Check admin permission
- if (currentUser?.role !== UserRole.ADMIN) {
-     return <div>Access Denied</div>;
- }
-
- const displayUsers = searchTerm ? searchResults : users;
-
- return (
-     <div>
-       <input
-         placeholder="Search users..."
-         value={searchTerm}
-         onChange={e => setSearchTerm(e.target.value)}
-       />
-
-       {isPending ? <Spinner /> : (
-         <Table>
-           {displayUsers?.map(user => (
-             <TableRow key={user.id}>
-               <td>{user.name}</td>
-               <td>{user.email}</td>
-               <td>{user.role}</td>
-               <td>
-                 <button onClick={() => updateUser({
-                   id: user.id,
-                   data: { role: UserRole.ADMIN }
-                 })}>
-                   Promote
-                 </button>
-                 <button onClick={() => deleteUser(user.id)}>
-                   Delete
-                 </button>
-               </td>
-             </TableRow>
-           ))}
-         </Table>
-       )}
-     </div>
- );
- }
  \*/

// ============================================================================
// 7. TESTING THE INTEGRATION
// ============================================================================

/\*\*

- Manual testing checklist:
-
- 1.  Login with admin account
- 2.  Call useCurrentUser() - should return admin user data
- 3.  Create admin page:
- - Display list of all users
- - Search users (type in search box)
- - Edit user role
- - Delete user (check cache updates)
- 4.  Verify cache invalidation after mutations
- 5.  Verify role-based access control (non-admin can't see /users/admin)
- 6.  Check backend logs for 403 responses if user tries to access endpoints
      \*/

// ============================================================================
// 8. NEXT STEPS
// ============================================================================

/\*\*

- 1.  Create /src/app/(root)/users/admin/page.tsx
- - List all users with pagination
- - Search functionality
- - Edit/delete actions
-
- 2.  Create /src/app/(root)/profile/page.tsx
- - Show current user details
- - Edit profile form
- - Update functionality
-
- 3.  Update /src/components/dashboard/app-header.tsx
- - Show current user in dropdown
- - Add admin link if role is ADMIN
-
- 4.  Add role-based route guards in middleware.ts
- - Redirect non-admins from /users/admin
-
- 5.  Test end-to-end with backend
      \*/
