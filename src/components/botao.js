import { Button } from 'react-native-paper';
import { StyleSheet} from "react-native";


const Botao = ({onPress, text, icon}) =>(
    
   <Button mode='outlined' icon={icon} theme={{colors: {primary: '#758fc8', outline: '#a7b0c4'}}} onPress={onPress} >{text}</Button>
)

const styles = StyleSheet.create({
    botoes: {
        flexDirection: 'row',
        gap: 30,
        marginBottom: 10,
        marginTop: 10,
      },
})

export default Botao;