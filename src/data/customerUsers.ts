export type CustomerGender = 'Nam' | 'Nữ' | 'Khác';

export interface CustomerUser {
  id: string;
  name: string;
  nickName: string | null;
  avatar: string | null;
  bod: string | null;
  sex: CustomerGender | null;
  createdAt: string;
  updatedAt: string;
  account: {
    username: string;
    email: string;
    phone: string | null;
    lockStatus: boolean;
    createdAt: string;
  };
}

export const MOCK_CUSTOMER_USERS: CustomerUser[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    nickName: 'An Nguyễn',
    avatar: null,
    bod: '1997-04-12',
    sex: 'Nam',
    createdAt: '2026-01-15T08:30:00',
    updatedAt: '2026-09-19T14:20:00',
    account: {
      username: 'nguyenvanan',
      email: 'nguyenvanan@gmail.com',
      phone: '0901 234 567',
      lockStatus: false,
      createdAt: '2026-01-15T08:30:00',
    },
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    nickName: 'Bình Trần',
    avatar: null,
    bod: '1994-11-24',
    sex: 'Nữ',
    createdAt: '2026-02-20T09:15:00',
    updatedAt: '2026-09-18T10:05:00',
    account: {
      username: 'tranthib',
      email: 'tranthib@gmail.com',
      phone: '0912 345 678',
      lockStatus: false,
      createdAt: '2026-02-20T09:15:00',
    },
  },
  {
    id: '3',
    name: 'Lê Minh Cường',
    nickName: null,
    avatar: null,
    bod: '1989-08-03',
    sex: 'Nam',
    createdAt: '2025-12-01T15:00:00',
    updatedAt: '2026-09-17T16:45:00',
    account: {
      username: 'leminhcuong',
      email: 'leminc@gmail.com',
      phone: '0923 456 789',
      lockStatus: false,
      createdAt: '2025-12-01T15:00:00',
    },
  },
  {
    id: '4',
    name: 'Phạm Thị Dung',
    nickName: 'Dung Phạm',
    avatar: null,
    bod: null,
    sex: 'Nữ',
    createdAt: '2026-03-05T11:30:00',
    updatedAt: '2026-09-16T09:25:00',
    account: {
      username: 'phamthidung',
      email: 'phamtd@gmail.com',
      phone: '0934 567 890',
      lockStatus: false,
      createdAt: '2026-03-05T11:30:00',
    },
  },
  {
    id: '5',
    name: 'Hoàng Văn Em',
    nickName: null,
    avatar: null,
    bod: '2000-02-14',
    sex: 'Nam',
    createdAt: '2026-04-10T13:45:00',
    updatedAt: '2026-09-15T17:10:00',
    account: {
      username: 'hoangvanem',
      email: 'hoangve@gmail.com',
      phone: '0945 678 901',
      lockStatus: true,
      createdAt: '2026-04-10T13:45:00',
    },
  },
  {
    id: '6',
    name: 'Vũ Thị Phương',
    nickName: 'Phương Vũ',
    avatar: null,
    bod: '1992-05-30',
    sex: 'Nữ',
    createdAt: '2025-08-20T10:00:00',
    updatedAt: '2026-09-14T11:40:00',
    account: {
      username: 'vuthiphuong',
      email: 'vuthip@gmail.com',
      phone: '0956 789 012',
      lockStatus: false,
      createdAt: '2025-08-20T10:00:00',
    },
  },
  {
    id: '7',
    name: 'Đặng Minh Quân',
    nickName: null,
    avatar: null,
    bod: null,
    sex: 'Nam',
    createdAt: '2026-05-12T08:15:00',
    updatedAt: '2026-09-13T15:30:00',
    account: {
      username: 'dangminhquan',
      email: 'dangmq@gmail.com',
      phone: '0967 890 123',
      lockStatus: false,
      createdAt: '2026-05-12T08:15:00',
    },
  },
  {
    id: '8',
    name: 'Bùi Thị Hoa',
    nickName: 'Hoa Bùi',
    avatar: null,
    bod: '1996-12-08',
    sex: 'Nữ',
    createdAt: '2026-01-30T14:20:00',
    updatedAt: '2026-09-12T10:55:00',
    account: {
      username: 'buithihoa',
      email: 'buithh@gmail.com',
      phone: '0978 901 234',
      lockStatus: false,
      createdAt: '2026-01-30T14:20:00',
    },
  },
];
