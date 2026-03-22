using MediatR;
using Shared.Domain.Common;

namespace IdentityService.Application.Commands.BlockUser;

// BlockUserCommand — Admin only
// Deactivates user — they cannot login
// User record is preserved for audit trail
public record BlockUserCommand(
    Guid UserId,
    Guid TenantId,
    bool Block) : IRequest<Result>;
