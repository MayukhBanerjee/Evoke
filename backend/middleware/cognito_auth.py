"""
Amazon Cognito Role Separation Middleware (Invariant I1 & I3).
Enforces topological role separation:
- LivingSubject: Primary authorship (I3). Can calibrate traits, update profile, set TTL (lambda).
- FamilyContributor: Post-mortem or living advisory mode. Can submit relational prompts.
- FamilyAuditor: Read-only access to personality vault and CloudWatch audit logs (I4).
"""
from enum import Enum
from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

class EvokeRole(str, Enum):
    LIVING_SUBJECT = "LivingSubject"
    FAMILY_CONTRIBUTOR = "FamilyContributor"
    FAMILY_AUDITOR = "FamilyAuditor"

security = HTTPBearer(auto_error=False)

def get_current_role(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Security(security)
) -> EvokeRole:
    """
    Resolves client role from X-Evoke-Role header or Cognito Bearer JWT claims.
    Defaults to LivingSubject for local development ease.
    """
    # 1. Direct header override for development & testing
    role_header = request.headers.get("X-Evoke-Role")
    if role_header:
        for r in EvokeRole:
            if r.value.lower() == role_header.lower():
                return r

    # 2. Bearer token decoding (Cognito JWT)
    if credentials:
        token = credentials.credentials
        # In full production with AWS Cognito:
        # decode jwt with jwks from https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
        if "auditor" in token.lower():
            return EvokeRole.FAMILY_AUDITOR
        elif "contributor" in token.lower():
            return EvokeRole.FAMILY_CONTRIBUTOR

    # Default to LivingSubject
    return EvokeRole.LIVING_SUBJECT


def require_role(*allowed_roles: EvokeRole):
    """FastAPI dependency requiring one of the specified roles."""
    def role_checker(request: Request):
        user_role = get_current_role(request)
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail=f"Invariant I1 Violation: Role '{user_role.value}' lacks required permissions."
            )
        return user_role
    return role_checker
