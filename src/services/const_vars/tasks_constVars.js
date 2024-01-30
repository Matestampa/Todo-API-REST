/*----------- Variables (no constantes tecnicamente) pero que no se modifican      ---------
//----------- especificamente por los endpoints del user. Sino que se pueden llegar ---------
//----------- a modificar cada tanto por el admin.                     ---------------------
//.---------  (Sirven para ciertas implementaciones generales del servicio)  ---------
*/

const ORDER_SCALE=1000; //escala usada para aumentar la column "pos"(posicion de la task),
                        //cada vez que se realiza un reordenamiento de las mismas. O se requiere
                        //asignar una nueva posicion.


module.exports={ORDER_SCALE};