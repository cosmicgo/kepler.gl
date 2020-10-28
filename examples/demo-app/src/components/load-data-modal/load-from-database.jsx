import React, {Component, useState} from 'react';
import {Formik, Form} from 'formik';
import {Segment, Header, Label, Select, Button, FormField} from 'semantic-ui-react';
//import {Button} from 'kepler.gl/components';
import {FormattedMessage} from 'react-intl';

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
  const [operation, setOperation] = useState("");
  const [dataToLoad, setDataToLoad] = useState("");

  const loadDataHandler = () => {
    console.log('test');
    console.log(startDate, endtDate, operation, dataToLoad);

    

    const data = Processors.processCsvData(testData);
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
            options={[{key: 'santiago', text: 'Santiago', value: 'santiago'}]}
            onChange={(e, { value })=>setOperation(value)}
          />
          <Label>Seleccione tipo de Datos</Label>
          <Select
            placeholder="Datos"
            name="datos"
            options={[
              {key: 'geocercas', text: 'Geocercas', value: 'geocercas'},
              {key: 'rides', text: 'Rides', value: 'rides'},
              {key: 'usuarios', text: 'Usuarios', value: 'usuarios'}
            ]}
            onChange={(e, { value }) => setDataToLoad(value)}
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
