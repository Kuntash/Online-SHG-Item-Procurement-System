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

export interface ApprovedBidder {
  shgId: string;
  shgname: string;
  shgcontact: string;
  shglocation: string;
  products: SHGProduct[];
  delivered: boolean;
  deliveryverified: boolean;
  _id: string;
  updatedAt: string;
  createdAt: string;
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
  delivered: boolean;
  deliveryverified: boolean;
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
  approvedquantity: number;
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
  approvedbid: ApprovedBidder[];
  createdAt: string;
  department: string;
  departmentid: string;
  instituteid: string;
  institutelocation: string;
  institutename: string;
  items: InstituteOrderItem[];

  status: 'pending' | 'approved' | 'cancelled' | 'completed';
}

export interface ApproveBidProductListType {
  productid: string;
  quantity: number;
}

export interface RouterStateType extends Location {
  state: {
    items: InstituteOrderItem[];
    id: string;
  };
}

export interface AdminOrderProduct {
  itemid: string;
  itemtype: 'loose' | 'packed';
  itemname: string;
  itemquantity: number;
  approvedquantity: number;
  itemunit: string;
  itemprice: number;
  itemdescription: string;
  _id: string;
}

export interface AdminOrderBid {
  shgId: string;
  shgname: string;
  shgcontact: string;
  shglocation: string;
  products: {
    shgproduct: string;
    quantity: number;
    unit: string;
    unitprice: number;
    totalprice: number;
    _id: string;
  }[];
  status: 'approved' | 'pending' | 'cancelled' | 'completed';
  _id: string;
  createdAt: string;
  updatedAt: string;
}
export interface AdminOrderDataType {
  _id: string;
  items: AdminOrderProduct[];
  bid: AdminOrderBid[];
  approvedbid: AdminOrderBid[];
  institutename: string;
  instituteid: string;
  department: string;
  institutelocation: string;
  status: 'approved' | 'pending' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface AdminSHGProduct {
  name: string;
  type: 'loose' | 'packed';
  quantity: number;
  unit: string;
  _id: string;
}

export interface AdminSHGOrder {
  orderid: string;
  institutename: string;
  institutelocation: string;
  department: string;
  products: AdminInstituteOrderedProduct[];
  delivered: boolean;
  deliveryverified: boolean;
  _id: string;
  createdat: string;
  updatedat: string;
}
export interface AdminSHGDataType {
  _id: string;
  name: string;
  contact: string;
  location: string;
  products: AdminSHGProduct[];
  createdAt: string;
  updatedAt: string;
  zone: {
    zoneid: string;
    zonename: string;
    _id: string;
  }[];
  orders: AdminSHGOrder[];
  totalrevenue: number;
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
}

export interface AdminChangedPriceOfBid {
  productid: string;
  unitprice: number;
}
