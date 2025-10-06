export const hasPermission = (perm, userPerms) => {
    return userPerms.includes(perm);
};

export const filterMenu = (menus, userPerms) => {
    return menus
        .map(menu => {
            if (menu.children) {
                const filteredChildren = menu.children.filter(child =>
                    hasPermission(child.permission, userPerms)
                );
                if (filteredChildren.length > 0) {
                    return { ...menu, children: filteredChildren };
                }
            }
            return hasPermission(menu.permission, userPerms) ? menu : null;
        })
        .filter(Boolean);
};
