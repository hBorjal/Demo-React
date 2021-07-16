import React, { useState } from 'react';
import { Button, Panel, Input, FlexboxGrid, Table, Alert } from 'rsuite';
import axios from 'axios';
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelSheet;
const ExcelColumn = ReactExport.ExcelColumn;

export function Home() {
	const [nameApp, setnameApp] = useState('');
	const [screen, setScreen] = useState([]);
	const [loading, setLoading] = useState(false);
	const { Column, HeaderCell, Cell, Pagination } = Table;
	async function getToken(){
		var url = "https://cotemardev.prod.apimanagement.us10.hana.ondemand.com:443/IDMApi/Authenticate";
		var obj = {
			"Username" : "hborjal",
			"Password" : "M3FNaWpab3ErR1U9",
			"Grant_type" : "password",
			"TypeCredential" : "0",
			"AppName" : "IDM",
			"AppNameSecurity" : "IDM"
		};
		const res = await axios.post(url,JSON.stringify(obj),{
				headers: {
					'Content-Type': 'application/json',
					'APIKey': '5RCnbMSL5GCq1j7S0JACd6UgSErV1qr4'
			  }})
		.then(response => {
            return response;
        })
        .catch(error => {
			console.log(error)
            return error;
        })
		if(res.status === 200) {
			return res.data;
		}else {
			alert(res)
		}
	}
	async function getTokenCIB(){
		var url = "https://cotemardev.prod.apimanagement.us10.hana.ondemand.com:443/IDMCFDev/Authenticate";
		var obj = {
			"Username" : "hborjal",
			"Password" : "M3FNaWpab3ErR1U9",
			"Grant_type" : "password",
			"TypeCredential" : "0",
			"AppName" : "CIB",
			"AppNameSecurity" : "CIB"
		};
		const res = await axios.post(url,JSON.stringify(obj),{
				headers: {
					'Content-Type': 'application/json',
			  }})
		.then(response => {
            return response;
        })
        .catch(error => {
            return error;
        })
		if(res.status === 200) {
			return res.data;
		}else {
			alert(res)
		}
	}
	async function getApp(){
		setLoading(true);
		var token = await getToken();
		var url = "https://cotemardev.prod.apimanagement.us10.hana.ondemand.com:443/IDMCFDev/Screens/GetScreenByNameApplication";
		const resp = await axios.get(url, {
			headers: {
				'Authorization' : 'Bearer ' + token.access_token,
				'Content-Type': 'application/json',
			},
			params: {
				NameApplication: nameApp
			}
		}).then(function (response) {
			setLoading(false);
			return response;
		})
		.catch(function (error) {
			setLoading(false);
			return error;
		  });
		if(resp.status === 200) {
			setScreen(resp.data)
			return resp.data;
		}else {
			alert(resp);
		}
	}
	async function uptPoreception(){
		var token = await getTokenCIB();
		var url = "https://cotemardev.prod.apimanagement.us10.hana.ondemand.com:443/APICIB/poreception";
		var obj = [{"Ebeln":"50469549","EstatusPedidoId":3}];
		const resp = await axios.put(url, JSON.stringify(obj),{
			headers: {
				'Authorization' : 'Bearer ' + token.access_token,
				'Content-Type': 'application/json',
			}
		}).then(function (response) {
			setLoading(false);
			return response;
		})
		.catch(function (error) {
			setLoading(false);
			return error;
		  });
		if(resp.status === 200) {
			alert('Successfully saved');
		}else {
			alert(resp);
		}
	}
	async function delDiscrepancyProf(){
		var token = await getTokenCIB();
		console.log(token)
		var url = "https://cotemardev.prod.apimanagement.us10.hana.ondemand.com:443/APICIB/discrepancycommentsorder/3";
		const resp = await axios.delete(url, {
			headers: {
				'Authorization' : 'Bearer ' + token.access_token,
				'Content-Type': 'application/json',
			}
		}).then(function (response) {
			setLoading(false);
			return response;
		})
		.catch(function (error) {
			setLoading(false);
			return error;
		  });
		if(resp.status === 200) {
			alert('Record deleted');
		}else {
			alert(resp);
		}
	}
	async function insApp(){
		var token = await getToken();
		var url = "https://cotemardev.prod.apimanagement.us10.hana.ondemand.com:443/IDMCFDev/Log/CreateLogUnusSync";
		var obj = {
			Application: "Demo React",
			Module: "Module One",
			Action: "Ninguna",
			RecordStatus: 0,
			ErrorCode: "",
			StackTrace: "",
			Message: "",
			Mis1: "",
			Mis2: ""
		}
		const resp = await axios.post(url, JSON.stringify(obj),{
			headers: {
				'Authorization' : 'Bearer ' + token.access_token,
				'Content-Type': 'application/json',
		  }})
		.then(response => {
			return response;
		})
		.catch(error => {
			return error;
		})
		if(resp.status === 200) {
			alert('Successfully saved');
		}else {
			alert(resp);
		}
	}
	const width = {
		width: '20%'
	}
	return (
		<div>
			<FlexboxGrid style={{marginTop: '8%'}} justify="space-around">
				<Panel style={width} bordered header="Get Screens by App Name">
					<Input type='text' value={nameApp} onChange={(e) => setnameApp(e)} size="md" placeholder="Name application"/>
					<Button style={{marginTop: '4.5%'}} appearance="ghost" onClick={getApp}>
						Click Me!!
					</Button>
				</Panel>
				<Panel style={width} bordered header="Insert Log UNUS (POST)">
					<Button appearance="ghost" onClick={insApp}>
						Click Me!!
					</Button>
				</Panel>
				<Panel style={width} bordered header="Get Token (POST)">
					<Button appearance="ghost" onClick={getToken}>
						Click Me!!
					</Button>
				</Panel>
				<Panel style={width} bordered header="Update Poreception (PUT)">
					<Button appearance="ghost" onClick={uptPoreception}>
						Click Me!!
					</Button>
				</Panel>
				<Panel style={width} bordered header="Delete Discrepancy Proforma (DELETE)">
					<Button appearance="ghost" onClick={delDiscrepancyProf}>
						Click Me!!
					</Button>
				</Panel>
			</FlexboxGrid>
			<ExcelFile filename="Screens" element={<Button appearance="ghost" color="green">Download xls</Button>}>
                <ExcelSheet data={screen} name="Screen data">
                    <ExcelColumn label="Id" value="ScreenId"/>
                    <ExcelColumn label="Screen Name" value="ScreenName"/>
                    <ExcelColumn label="Tooltip" value="Tooltip"/>
                    <ExcelColumn label="Action Url" value="ActionUrl"/>
                </ExcelSheet>
            </ExcelFile>
			<Table loading={loading} height={400} data={screen}>
				<Column width={70} align="center" fixed>
					<HeaderCell>Id</HeaderCell>
					<Cell dataKey="ScreenId" />
				</Column>
				<Column width={200} align="center">
					<HeaderCell>Screen Name</HeaderCell>
					<Cell dataKey="ScreenName" />
				</Column>
				<Column width={200} align="center">
					<HeaderCell>Tooltip</HeaderCell>
					<Cell dataKey="Tooltip" />
				</Column>
				<Column width={200} align="center">
					<HeaderCell>Action Url</HeaderCell>
					<Cell dataKey="ActionUrl" />
				</Column>
			</Table>
		</div>
	);
}
