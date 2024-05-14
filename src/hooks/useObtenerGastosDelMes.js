import {useState, useEffect} from 'react';
import { db } from './../firebase/firebaseConfig';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore'; 
import { startOfMonth, endOfMonth, getUnixTime } from 'date-fns';
import { useAuth } from './../contextos/AuthContext';

const useObtenerGastosDelMes = () => {
    const [gastos, establecerGastos] = useState([]);
    const {usuario} = useAuth();

    useEffect(() => {
        const inicioDeMes = getUnixTime(startOfMonth(new Date()));
        const finDeMes = getUnixTime(endOfMonth(new Date()));

        if(usuario){
            const consulta = query(
                collection(db, 'gastos'), 
                orderBy('fecha','desc'),
                where('fecha', '>=', inicioDeMes),
                where('fecha', '<=', finDeMes),
                where('uidUsuario', '==', usuario.uid)
            );
    
            const unsuscribe = onSnapshot(consulta, (snapShot) => {
                establecerGastos(snapShot.docs.map((documento) => {
                    return {...documento.data(), id: documento.id}
                }))
            }, (error) => {console.log(error)})

            //useEffect tiene que retornar una función que se va a ejecutar 
            //cuando se desmonte el componente.
            //En este caso queremos que ejecute el unsuscribe a la colección de firestore.
            return unsuscribe;
        }
    },[usuario]);

    return gastos;
}
 
export default useObtenerGastosDelMes;