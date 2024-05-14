import React from 'react';
import { Header, Titulo } from './../elementos/Header'
import { Helmet } from 'react-helmet';
import BtnRegresar from './../elementos/BtnRegresar';
import BarraTotalGastado from './BarraTotalGastado';
import FormularioGasto from './FormularioGasto';
import { useParams } from 'react-router-dom';
import useObtenerGasto from './../hooks/useObtenerGasto';

const EditarGasto = () => {
    const {id} = useParams();
    const [gasto] = useObtenerGasto(id);

    return (  
        <>
        <Helmet>
          <title>Gastos por Categoria</title>
        </Helmet>
  
        <Header>
            <BtnRegresar ruta="/lista" /> 
            <Titulo>Gastos por Categoria</Titulo>
        </Header>

        <FormularioGasto gasto={gasto}/>

        <BarraTotalGastado/>
      </>
    );
}
 
export default EditarGasto;