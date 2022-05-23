import { Location } from 'react-router-dom';

interface User {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  userType?: 'ceo' | 'department' | 'institute';
  email: string | undefined;
  token: string | undefined;
  userData?: {
    name: string;
    location: string;
    savedorders?: {
      itemid: string;
      itemquantity: number;
    };
  };
  error?: string;
}

export interface SHGProduct {
  shgproduct: string;
  quantity: number;
  unit: string;
  unitprice: number;
  totalprice: number;
  _id: string;
}

export interface Bidder {
  shgId: string;
  shgname: string;
  shgcontact: string;
  shglocation: string;
  products: SHGProduct[];
  status: 'approved' | 'pending' | 'cancelled';
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  _id: string;
  itemtype: 'loose' | 'packed';
  itemname: string;
  itemdescription: string;
  itemunit?: string;
}

export interface PlaceOrderItem extends Item {
  itemquantity: number;
}

export interface InstituteOrderItem {
  itemname: string;
  itemquantity: number;
  itemunit: string;
  itemprice: string;
  itemid: string;
  itemtype: 'loose' | 'packed';
  itemdescription: string;
}

export interface InstituteOrder {
  _id: string;
  approvedfordisplay: boolean;
  bid: Bidder[];
  createdAt: string;
  department: string;
  departmentid: string;
  instituteid: string;
  institutelocation: string;
  institutename: string;
  items: InstituteOrderItem[];

  status: 'pending' | 'approved' | 'cancelled' | 'completed';
}

export interface RouterStateType extends Location {
  state: {
    items: InstituteOrderItem[];
    id: string;
  };
}
