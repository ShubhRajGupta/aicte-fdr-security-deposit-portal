package org.aicte.fdr.identity;

import java.io.Serializable;
import java.security.Principal;
import java.util.Collections;
import java.util.Set;

public record UserPrincipal(
    String userId,
    String username,
    String fullName,
    String email,
    UserRole role,
    String institutionId,
    String regionalOffice,
    Set<String> permissions
) implements Principal, Serializable {

    @Override
    public String getName() {
        return username;
    }

    public boolean hasPermission(String permission) {
        return permissions != null && permissions.contains(permission);
    }
}
