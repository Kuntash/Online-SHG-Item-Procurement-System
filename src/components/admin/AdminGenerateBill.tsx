import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  RadioGroupState,
  TableBody,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Grid } from 'swiper';
import { useAppSelector } from '../../app/hooks';
import { backendUrl } from '../../config';
import { selectUser } from '../../features/auth/authSlice';
import {
  ContainerRowBox,
  StyledContainer,
  StyledPaper,
  StyledStatus,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableRow,
} from '../custom';

import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parseISO } from 'date-fns';
import { CalendarPickerView } from '@mui/x-date-pickers/CalendarPicker';
import Loading from '../utility/Loading';
import { flexbox } from '@mui/system';
import Loading2 from '../utility/Loading2';
import Checkbox from '@mui/material/Checkbox';
import { CSVLink } from "react-csv";
import TableViewIcon from '@mui/icons-material/TableView';

const generateByList = ['department', 'shg', 'item'];
const reportTypeList = ['month', 'year', 'date'];

interface Ilabel{
  label: string;
  key: string;
  selected: boolean;
}
const labels:Ilabel[] = [
  {
    label:'Order Date',
    key:'createdAt',
    selected:true
  },
  {
    label:'Institute Name',
    key:'institutename',
    selected:true
  },
  {
    label:'Status',
    key:'status',
    selected:true
  },
  {
    label:'Total Price',
    key:'itemstotalprice',
    selected:true
  },
  {
    label:'Total Quantity',
    key:'itemstotalquantity',
    selected:true
  },
  {
    label:'Department',
    key:'department',
    selected:true
  },
  {
    label:'Institute Contact',
    key:'institutecontact',
    selected:true
  },
  {
  label:'Institute Location',
  key:'instutelocation',
  selected:true
  }
]

const getHeaders = (userToken: string) => {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${userToken}`);
  headers.append('Content-type', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');
  return headers;
};

interface IDepartmentData {
  _id: string;
  department: string;
}
interface IShgData {
  _id: string;
  name: string;
}

interface IItemData {
  itemname: string;
  itemprice: number;
  itemtype: string;
  _id: string;
  itemunit: string;
}

const getDepartmentList = async (userToken: string) => {
  try {
    const headers = getHeaders(userToken);
    const requestOptions: RequestInit = {
      method: 'GET',
      headers,
      redirect: 'follow',
    };
    const response = await fetch(
      `${backendUrl}ceo/getdepartments`,
      requestOptions
    );
    if (response.status === 400)
      throw new Error('Error occurred while getting saved order');
    const result = await response.json();
    return result.departmentdata as IDepartmentData[];
  } catch (err) {
    console.log(err);
    return [] as IDepartmentData[];
  }
};
const getItemList = async (userToken: string) => {
  try {
    const headers = getHeaders(userToken);
    const requestOptions: RequestInit = {
      method: 'GET',
      headers,
      redirect: 'follow',
    };
    const response = await fetch(
      `${backendUrl}order/getallitems`,
      requestOptions
    );
    if (response.status === 400)
      throw new Error('Error occurred while getting saved order');
    const result = await response.json();
    return result as IItemData[];
  } catch (err) {
    console.log(err);
    return [] as IItemData[];
  }
};
const getShgList = async (userToken: string) => {
  try {
    const headers = getHeaders(userToken);
    const requestOptions: RequestInit = {
      method: 'GET',
      headers,
      redirect: 'follow',
    };
    const response = await fetch(`${backendUrl}ceo/getshgdata`, requestOptions);
    if (response.status === 400)
      throw new Error('Error occurred while getting saved order');
    const result = await response.json();
    return result.data as IShgData[];
  } catch (err) {
    console.log(err);
    return [] as IShgData[];
  }
};

const getDepartmentReport = async (
  userToken: string,
  id: string,
  type: string,
  value: number | string,
  value2?: number | string
) => {
  try {
    const headers = getHeaders(userToken);
    const raw = {
      departmentid: id,
      reporttype: type,
      value: value,
      value2: value2
    };
    console.log(JSON.stringify(raw));
    const requestOptions: RequestInit = {
      method: 'POST',
      headers,
      redirect: 'follow',
      body: JSON.stringify(raw),
    };
    const response = await fetch(
      `${backendUrl}ceo/getreportofdepartment`,
      requestOptions
    );
    if (response.status === 400)
      throw new Error('Error occurred while getting saved order');
    const result = await response.json();
    console.log('department report', result);
    return result.modifiedorderdata;
  } catch (err) {
    console.log(err);
  }
};
const getShgReport = async (
  userToken: string,
  id: string,
  type: string,
  value: number | string,
  value2?: number | string
) => {
  try {
    const headers = getHeaders(userToken);
    const raw = {
      shgid: id,
      reporttype: type,
      value: value,
      value2: value2
    };
    console.log(JSON.stringify(raw));
    const requestOptions: RequestInit = {
      method: 'POST',
      headers,
      redirect: 'follow',
      body: JSON.stringify(raw),
    };
    const response = await fetch(
      `${backendUrl}ceo/getreportofshg`,
      requestOptions
    );
    if (response.status === 400)
      throw new Error('Error occurred while getting saved order');
    const result = await response.json();
    return result.modifiedorderdata;
  } catch (err) {
    console.log(err);
  }
};

const getItemReport = async (
  userToken: string,
  id: string,
  type: string,
  value: number | string,
  value2?: number | string
) => {
  try {
    const headers = getHeaders(userToken);
    const raw = {
      itemid: id,
      reporttype: type,
      value: value,
      value2: value2,
    };
    console.log(JSON.stringify(raw));
    const requestOptions: RequestInit = {
      method: 'POST',
      headers,
      redirect: 'follow',
      body: JSON.stringify(raw),
    };
    const response = await fetch(
      `${backendUrl}ceo/getreportofproduct`,
      requestOptions
    );
    if (response.status === 400)
      throw new Error('Error occurred while getting saved order');
    const result = await response.json();

    console.log('item report', result);
    return result.modifiedorderdata;
  } catch (err) {
    console.log(err);
  }
};

interface AdminOrderDetailsTableProps {
  orderId: string;
  orderedBy: string;
  orderedAt: string;
  department: string;
  instituteLocation: string;
  orderStatus: string;
}
const AdminGenerateBill = () => {
  const [tablelabels,settablelabels] = useState<Ilabel[]>(labels)
  const [generateby, setGenerateBy] = useState('');
  const [status, setStatus] = useState('');
  const [departmentList, setDepartmentList] = useState<IDepartmentData[]>([]);
  const [itemList, setItemList] = useState<IItemData[]>([]);
  const [shgList, setShgList] = useState<IShgData[]>([]);
  const [reportType, setReportType] = useState('');
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const [value2,setValue2] = React.useState<Dayjs | null>(dayjs());
  const [selectedDepartment, setSelectedDepartment] =
    useState<IDepartmentData | null>(null);
  const [selectedItem, setSelectedItem] = useState<IItemData | null>(null);
  const [selectedShg, setSelectedShg] = useState<IShgData | null>(null);
  const [report, setReport] = useState<any>([]);
  const user = useAppSelector(selectUser);

  console.log(value?.year());

  const handleRadioChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (status === 'loading') return;
    setReport([]);
    setStatus('loading');
    setGenerateBy(e.target.value);
    switch (e.target.value) {
      case 'department':
        const dlist = await getDepartmentList(user.token || '');
        setDepartmentList(dlist);
        setStatus('');
        break;
      case 'shg':
        const slist = await getShgList(user.token || '');
        console.log('usertoken', user.token);
        console.log(slist);
        setShgList(slist);
        setStatus('');
        break;
      case 'item':
        const ilist = await getItemList(user.token || '');
        setItemList(ilist);
        setStatus('');
        break;
    }
  };


  const handleReportTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (status === 'loading') return;
    setReportType(e.target.value);
  };
  useEffect(() => {
    console.log(generateby, selectedDepartment, reportType);
    const fetchdata = async () => {
      if (generateby === '' || reportType === '' || !user || !user.token)
        return;
      if (!value) return;
      let d = 1;
      if (reportType === 'month') d = value.month() + 1;
      if (reportType === 'year') d = value.year();
      if (reportType === 'date') d = value.day() + 1;
      switch (generateby) {
        case 'department':
          if (!selectedDepartment) return;
          const departmentorders = await getDepartmentReport(
            user.token,
            selectedDepartment._id,
            reportType,
            d
          );
          setReport({ reportType: 'department', list: departmentorders });
          return;
        case 'item':
          if (!selectedItem) return;
          const itemorders = await getItemReport(
            user.token,
            selectedItem._id,
            reportType,
            d
          );
          setReport({ reportType: 'item', list: itemorders });
          return;
        case 'shg':
          if (!selectedShg) return;
          const shgorders = await getShgReport(
            user.token,
            selectedShg._id,
            reportType,
            d
          );
          setReport({ reportType: 'shg', list: shgorders });
          return;
      }
    };
    fetchdata();
  }, [
    generateby,
    selectedDepartment,
    selectedItem,
    selectedShg,
    reportType,
    value,
  ]);

  const handleSelectLabels = (e:ChangeEvent<HTMLInputElement>,index:number) => {
    const check = e.target.checked;
    const newlabels = [...tablelabels]
    if(!check) tablelabels[index].selected = false;
    else tablelabels[index].selected = true;
    settablelabels(newlabels);
  };



  const getReport = () => {
    if (!report || !report.list) return;
    return (
      <>
      <ContainerRowBox justifyContent='flex-end' gap='1rem' alignItems='center'>
        <Typography variant='body1' fontWeight='bold'>Download:</Typography>
          <CSVLink data={report.list} headers={tablelabels.filter(lable=>lable.selected)} filename={"report - "+format(new Date(), 'do MMM yyyy')}> <TableViewIcon color='primary' /> </CSVLink>
          </ContainerRowBox>
        <ContainerRowBox gap="2rem">
          <Typography
            variant="body1"
            fontWeight="bold"
          >
            Total Quantity:{' '}
            {report.list.reduce(
              (totalquantity: any, order: any) =>
                totalquantity + order.itemstotalquantity,
              0
            )}{' '}
          </Typography>
          <Typography
            variant="body1"
            fontWeight="bold"
          >
            Total Price:{' '}
            {report.list.reduce(
              (totalprice: any, order: any) =>
                totalprice + order.itemstotalprice,
              0
            )}{' '}
          </Typography>
          <Typography
            variant="body1"
            fontWeight="bold"
          >
            Total Orders :
            {report.list.length}
          </Typography>
        </ContainerRowBox>
        <ContainerRowBox>
        {tablelabels.map((label, index) =>
        
  <FormControlLabel control={<Checkbox
      checked={label.selected}
      onChange={(e)=>handleSelectLabels(e,index)}
      inputProps={{ 'aria-label': label.label }}
    />} label={label.label} />

       )}
        </ContainerRowBox>
        <StyledTable>
          <StyledTableHead sx={{ fontSize: '1rem' }}>
            <TableRow>
                  {tablelabels.map((label) =>{
                    if(label.selected === false) return <></>
                  return <StyledTableCell>{label.label}</StyledTableCell>
                  })}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {report.list.map((order: any) => (
              <>
                <StyledTableRow sx={{ fontSize: '0.875rem' }}>
                  {tablelabels.map((label) =>{
                    if(label.selected === false) return <></>
                    if (label.key === 'createdAt') {
                      return  <StyledTableCell sx={{ marginTop: '1rem' }}>
                    {format(parseISO(order.createdAt), 'do MMM yyyy')}
                  </StyledTableCell>}
                  return <StyledTableCell>{order[label.key]}</StyledTableCell>
                  })}
                  {/* <StyledTableCell sx={{ marginTop: '1rem' }}>
                    {format(parseISO(order.createdAt), 'do MMM yyyy')}
                  </StyledTableCell>
                  <StyledTableCell>{order.institutename}</StyledTableCell>
                  <StyledTableCell>{order.status}</StyledTableCell>
                  <StyledTableCell>{order.itemstotalprice}</StyledTableCell>
                  <StyledTableCell>{order.itemstotalquantity}</StyledTableCell> */}
                </StyledTableRow>
              </>
            ))}
          </TableBody>
        </StyledTable>
      </>
    );
  };

  useEffect(() => {
    console.log('report ', report);
  }, [report]);
  useEffect(() => {
    console.log('shglist', shgList);
  }, [shgList]);

  const getSelectedComponent = () => {
    if (status === 'loading') return;
    switch (generateby) {
      case 'department':
        return (
          <>
            <StyledContainer
              sx={{
                display: 'flex',
                flexFlow: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Autocomplete
                blurOnSelect
                onChange={(e, value) => {
                  if (value === null) return;
                  setSelectedDepartment(value);
                }}
                options={departmentList}
                getOptionLabel={(option) => option.department}
                sx={{ width: '200px' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Departments"
                  />
                )}
              />
            </StyledContainer>
          </>
        );
      case 'item':
        return (
          <>
            <StyledContainer
              sx={{
                display: 'flex',
                flexFlow: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Autocomplete
                blurOnSelect
                onChange={(e, value) => {
                  if (value === null) return;
                  setSelectedItem(value);
                }}
                options={itemList}
                getOptionLabel={(option) => option.itemname}
                sx={{ width: '200px' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Items"
                  />
                )}
              />
            </StyledContainer>
          </>
        );
      case 'shg':
        return (
          <>
            <StyledContainer
              sx={{
                display: 'flex',
                flexFlow: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Autocomplete
                blurOnSelect
                onChange={(e, value) => {
                  if (value === null) return;
                  setSelectedShg(value);
                }}
                options={shgList}
                getOptionLabel={(option) => option.name}
                sx={{ width: '200px' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="SHGS"
                  />
                )}
              />
            </StyledContainer>
          </>
        );
      default:
        return <></>;
    }
  };

  const getValueComponent = () => {
    if (reportType === '') return;

    const view = [];
    if (reportType === 'year') {
      view.push('year');
    }
    if (reportType === 'month') {
      view.push('month');
    }
    if (reportType === 'date') {
      view.push('year');
      view.push('month');
      view.push('day');
    }
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={view as CalendarPickerView[]}
          label={reportType === 'date'?'From': (reportType.toUpperCase() + ' Only')}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              helperText={null}
            />
          )}
        />
        {reportType === 'date'?<>
        <DatePicker
          views={view as CalendarPickerView[]}
          label="To"
          value={value2}
          onChange={(newValue) => {
            setValue2(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              helperText={null}
            />
          )}
        />
        </>
        :<></>}
      </LocalizationProvider>
    );
  };

  return (
    <StyledPaper>
      <StyledContainer
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          flexDirection: 'row',
        }}
      >
        <StyledContainer sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Typography variant="h2">Generate Report</Typography>
        </StyledContainer>
        <StyledContainer sx={{ opacity: status === 'loading' ? 1 : 0 }}>
          <Loading2 />
        </StyledContainer>
      </StyledContainer>
      <ContainerRowBox
        justifyContent="start"
        gap="1rem"
      >
        <FormControl>
          <FormLabel id="generateby">Generate by</FormLabel>
          <RadioGroup
            aria-labelledby="Generate By"
            name="Generate By"
            value={generateby}
            onChange={handleRadioChange}
          >
            {generateByList.map((e, i) => (
              <FormControlLabel
                value={e}
                key={i}
                control={<Radio />}
                label={e.toUpperCase()}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <div>{getSelectedComponent()}</div>
        {selectedDepartment || selectedItem || selectedShg ? (
          <FormControl>
            <FormLabel id="generateby">Report Type</FormLabel>
            <RadioGroup
              aria-labelledby="Report Type"
              name="Report Type"
              value={reportType}
              onChange={handleReportTypeChange}
            >
              {reportTypeList.map((e, i) => (
                <FormControlLabel
                  value={e}
                  key={i}
                  control={<Radio />}
                  label={e.toUpperCase()}
                />
              ))}
            </RadioGroup>
          </FormControl>
        ) : (
          <></>
        )}
        {getValueComponent()}
      </ContainerRowBox>
      {getReport()}
    </StyledPaper>
  );
};

export default AdminGenerateBill;
