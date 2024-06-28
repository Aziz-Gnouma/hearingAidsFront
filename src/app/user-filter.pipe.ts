import { Pipe, PipeTransform } from '@angular/core';
import { Product, User, orders } from './User';

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {
  transform(users: User[], searchTerm: string): User[] {
    if (!users || !searchTerm) {
      return users;
    }
    
    searchTerm = searchTerm.toLowerCase();
    
    return users.filter(user => 
      user.cin.toString().includes(searchTerm) ||
      user.userFirstName.toLowerCase().includes(searchTerm) ||
      user.userLastName.toLowerCase().includes(searchTerm)
    );
  }


}


@Pipe({
  name: 'ordersfilter'
})
export class ordersfilterPipe implements PipeTransform {
  transform(users: orders[], searchTerm: string): orders[] {
    if (!users || !searchTerm) {
      return users;
    }
    
    searchTerm = searchTerm.toLowerCase();
    
    return users.filter(user => 
      user.purchaseDate.toString().includes(searchTerm) ||
      user.productName.toLowerCase().includes(searchTerm) 
    );
  }

}

@Pipe({
  name: 'Productsfilter'
})
export class ProductsfilterPipe implements PipeTransform {
  transform(users: Product[], searchTerm: string): Product[] {
    if (!users || !searchTerm) {
      return users;
    }
    
    searchTerm = searchTerm.toLowerCase();
    
    return users.filter(user => 
      user.category.toString().includes(searchTerm) ||
      user.productName.toLowerCase().includes(searchTerm) 
    );
  }

}




@Pipe({
  name: 'roleFilter'
})
export class RoleFilterPipe implements PipeTransform {
  transform(users: User[], searchTerm: string, filterByRole: string): User[] {
    if (!users || (!searchTerm && !filterByRole)) {
      return users;
    }
    
    let filteredUsers = users;

    if (filterByRole) {
      const filterByRoleLower = filterByRole.toLowerCase();
      if (filterByRoleLower === 'rh') {
        // Filter users with roles "GRH" or "SGRH"
        filteredUsers = filteredUsers.filter(user =>
          user.role.some(role => ['grh', 'sgrh'].includes(role.roleName.toLowerCase()))
        );
      } else if (filterByRoleLower === 'user') {
        // Filter users excluding roles "GRH", "SGRH", "Gerant", and "Archiver"
        filteredUsers = filteredUsers.filter(user =>
          !['grh', 'sgrh', 'gerant', 'archiver'].includes(user.role[0]?.roleName.toLowerCase())
        );
      }
    }
    

    return filteredUsers;
  }
}