import {useState, useEffect} from 'react';
import {db} from './../firebase/firebaseConfig';
import { collection, onSnapshot, query, orderBy, where, limit, startAfter } from 'firebase/firestore'; 
import { useAuth } from './../contextos/AuthContext';

const useObtenerGastos = () => {
    const {usuario} = useAuth();
    const [gastos, cambiarGastos] = useState([]);
    const [ultimoGasto, cambiarUltimoGasto] = useState(null);
    const [hayMasPorCargar, cambiarHayMasPorCargar] = useState(false);

    const obtenerMasGastos = () => {
        const consulta = query(
            collection(db, 'gastos'), 
            where('uidUsuario', '==', usuario.uid),
            orderBy('fecha','desc'),
            limit(10),
            startAfter(ultimoGasto)
        );

        onSnapshot(consulta, (snapShot) => {
            if(snapShot.docs.length > 0){
                cambiarUltimoGasto(snapShot.docs[snapShot.docs.length - 1]);
            
                cambiarGastos(gastos.concat(snapShot.docs.map((gasto) => {
                    return {...gasto.data(), id: gasto.id}
                })))
            }else{
                cambiarHayMasPorCargar(false);
            }
        }, error => {console.log(error)});
    }

    useEffect(() => {
        const consulta = query(
            collection(db, 'gastos'), 
            where('uidUsuario', '==', usuario.uid),
            orderBy('fecha','desc'),
            limit(10),
        );
    
        const unsuscribe = onSnapshot(consulta, (snapShot) => {
            if(snapShot.docs.length > 0){
                cambiarUltimoGasto(snapShot.docs[snapShot.docs.length - 1]);
                cambiarHayMasPorCargar(true);
            }else{
                cambiarHayMasPorCargar(false);
            }

            cambiarGastos(snapShot.docs.map((gasto) => { 
                return {...gasto.data(), id: gasto.id}
            }));
        });
        
        return unsuscribe;
    }, [usuario]);

    return [gastos, obtenerMasGastos, hayMasPorCargar];
}
 
export default useObtenerGastos;