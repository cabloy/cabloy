export default {
  AuthorizeMcpAccess: 'Authorize MCP access',
  LoadingAuthorizationRequest: 'Loading authorization request…',
  AuthorizationRequestUnavailable:
    'This authorization request is invalid, expired, or no longer available. Start again from the application.',
  AuthorizationConsentHelp:
    'Review the application and the access it is requesting before continuing.',
  Application: 'Application',
  Resource: 'Resource',
  RequestedScopes: 'Requested scopes',
  RequestExpires: 'Request expires',
  AuthorizationReadScopeHelp:
    'mcp:read allows read-only MCP tools. Your existing account permissions still apply.',
  AuthorizationAllScopeHelp:
    'mcp:all allows all MCP capabilities, including changes to data, within your existing account permissions. It does not grant administrator access.',
  Deny: 'Deny',
  Approve: 'Approve',
  McpAuthorizations: 'MCP authorizations',
  McpAuthorizationsHelp: 'Manage applications authorized to use MCP with your account.',
  McpAuthorizationsRetention:
    'Expired and revoked records may be automatically removed. This is not a permanent history.',
  McpAuthorizationsEmpty: 'You have no saved MCP authorizations.',
  McpAuthorizationsLoading: 'Loading MCP authorizations…',
  McpAuthorizationsLoadFailed: 'MCP authorizations could not be loaded. Please try again.',
  McpAuthorizationRevokeConfirm:
    'Revoke this authorization? The application will no longer be able to use its access token, refresh token, or authorization code.',
  McpAuthorizationDeleteConfirm:
    'Delete this authorization record? Its tokens and authorization code will stop working. The application registration and your sign-in account will not be deleted.',
  McpAuthorizationStatus: 'Authorization status',
  McpAuthorizationCodeReady: 'Awaiting token exchange',
  McpAuthorizationTokenActive: 'Issued (check expiry below)',
  McpAuthorizationDenied: 'Denied',
  McpAuthorizationRevoked: 'Revoked',
  McpAuthorizationPending: 'Awaiting consent',
  McpAuthorizationCreated: 'Created',
  McpAuthorizationAccessExpires: 'Access token expires',
  McpAuthorizationRefreshExpires: 'Refresh authorization expires',
  McpAuthorizationRefreshDisabled: 'Refresh not enabled',
  McpAuthorizationNotIssued: 'Not issued',
  McpAuthorizationClientId: 'Client ID',
  McpAuthorizationsPage: 'Page %d of %d · %s records',
  Refresh: 'Refresh',
  Retry: 'Retry',
  Revoke: 'Revoke',
  Delete: 'Delete',
  Previous: 'Previous',
  Next: 'Next',
};
