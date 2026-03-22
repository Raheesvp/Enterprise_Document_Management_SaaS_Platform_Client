using IdentityService.Domain.Errors;
using IdentityService.Domain.Repositories;
using MediatR;
using Shared.Domain.Common;

namespace IdentityService.Application.Commands.BlockUser;

public sealed class BlockUserCommandHandler
    : IRequestHandler<BlockUserCommand, Result>
{
    private readonly IUserRepository _userRepo;

    public BlockUserCommandHandler(IUserRepository userRepo)
        => _userRepo = userRepo;

    public async Task<Result> Handle(
        BlockUserCommand command,
        CancellationToken cancellationToken)
    {
        // 1. Find user — must belong to same tenant
        var user = await _userRepo.GetByIdAsync(
            command.UserId, cancellationToken);

        if (user is null || user.TenantId != command.TenantId)
            return Result.Failure(IdentityErrors.User.NotFound(
                command.UserId));

        // 2. Cannot block Admin
        if (user.Role == Domain.Enums.UserRole.Admin)
            return Result.Failure(
                new Error("User.CannotBlockAdmin",
                    "Admin users cannot be blocked"));

        // 3. Apply block or unblock
        if (command.Block)
            user.Deactivate();
        else
            user.Activate();

        await _userRepo.UpdateAsync(user, cancellationToken);

        return Result.Success();
    }
}
