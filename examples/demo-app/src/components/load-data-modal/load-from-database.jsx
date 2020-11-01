import React, {Component, useEffect, useState} from 'react';
import {Formik, Form} from 'formik';
import {Segment, Header, Label, Select, Button, FormField} from 'semantic-ui-react';
//import {Button} from 'kepler.gl/components';
import {FormattedMessage} from 'react-intl';
import axios from 'axios';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as moment from 'moment';

import PropTypes from 'prop-types';
import {addDataToMap} from 'kepler.gl/actions';
import Processors from 'kepler.gl/processors';
import testData from '../../data/cosmic-csv';
import {useDispatch} from 'react-redux';

// const propTypes = {
//   onLoadRemoteMap: PropTypes.func.isRequired
// };
const consultarOperaciones = async() =>{
  try {
    const opSelect = await axios(
      `https://iaajg116kd.execute-api.us-west-2.amazonaws.com/prod/operatio/getOperations`,
      {
        method: 'GET',
        mode: 'no-cors',
        crossdomain: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      }
    );
    //console.log(opSelect.data);

    return opSelect.data
  } catch (err) {
    return []
  }
};
//class LoadFromDb extends Component {
export default function LoadFromDb() {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(
    new Date(
      moment()
        .subtract(7, 'day')
        .toISOString()
    )
  );
  const [endtDate, setEndDate] = useState(new Date());
  const [operation, setOperation] = useState('');
  const [operationList, setOperationList] = useState();
  const [dataToLoad, setDataToLoad] = useState('');

  useEffect( () => {
    consultarOperaciones().then(value => setOperationList(value) );
        
  }, []);

  

  const loadDataHandler = async () => {
    console.log('test');
    console.log(
      startDate.toISOString().split('T')[0],
      endtDate.toISOString().split('T')[0],
      operation,
      dataToLoad
    );

    try {
      const dbData = await axios(
        `https://iaajg116kd.execute-api.us-west-2.amazonaws.com/prod/rides/getRides?idOperation=${operation}&initDate=${
          startDate.toISOString().split('T')[0]
        }&endDate=${endtDate.toISOString().split('T')[0]}`,
        {
          method: 'GET',
          mode: 'no-cors',
          crossdomain: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': '*/*'
          }
        }
      );
      //console.log('data',dbData.data);

      const data = Processors.processCsvData(dbData.data);
      // Create dataset structure

      const dataset = {
        data,
        info: {
          // `info` property are optional, adding an `id` associate with this dataset makes it easier
          // to replace it later
          id: 'my_data'
        }
      };
      // addDataToMap action to inject dataset into kepler.gl instance
      dispatch(addDataToMap({datasets: dataset}));
    } catch (err) {
      console.log('error', err);
    }

    // const dbData = dbDataProm.body.text();
  };
  
  return (
    
    <Segment>
      <Formik
        initialValues={{
          datos: '',
          operacion: '',
          startDate: '',
          endDate: ''
        }}
        onSubmit={async values => {
          //console.log(JSON.stringify({...startDate, ...endtDate, ...operation, ...dataToLoad}));
          try {
            loadDataHandler();
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <Form className="ui form">
          <Header content="Cargar desde Bd" />
          <Label>Seleccione Operacion</Label>
          <Select
            placeholder="Operacion"
            name="operacion"
            options={operationList}
            onChange={(e, {value}) => setOperation(value)}
          />
          <Label>Seleccione tipo de Datos</Label>
          <Select
            placeholder="Datos"
            name="datos"
            options={[
              {key: 'santiago', text: 'Santiago', value: 'faa045d0-07c9-11ea-b69e-5ffcccd216e3'}
            ]}
            onChange={(e, {value}) => setDataToLoad(value)}
          />
          <FormField>
            <label>Escoger rango de fechas</label>
            Inicio
            <DatePicker
              placeholderText="Date"
              name="startDate"
              timeFormat="HH:mm"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyy h:mm a"
              selected={(startDate && new Date(startDate)) || null}
              onChange={date => setStartDate(date)}
            />
          </FormField>
          <FormField>
            Fin
            <DatePicker
              placeholderText="Date"
              name="endDate"
              timeFormat="HH:mm"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyy h:mm a"
              selected={(endtDate && new Date(endtDate)) || null}
              onChange={date => setEndDate(date)}
            />
          </FormField>
          <Button type="submit" size="small">
            {' '}
            {
              //onClick={() => loadDataHandler()}
            }{' '}
            <FormattedMessage id={'Cargar'} />
          </Button>
        </Form>
      </Formik>
    </Segment>
  );
}
