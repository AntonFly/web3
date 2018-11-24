

import java.util.logging.FileHandler;
import java.util.logging.Logger;
import javax.faces.bean.ManagedBean;

@ManagedBean(name="YValidator")
public class YValidator {
    private static final double minY = -5;
    private static final double maxY = 3;
    private final Logger logger= Logger.getLogger("logger");;
    private String fieldText="";
    private String respText ;

    public void setFieldText(String fieldText) {
        this.fieldText = fieldText;
    }

    public String getFieldText() {

        return fieldText;
    }

    public String getRespText() {
        return respText;
    }

    public String validation() {
        try {

            if(fieldText.equals("")) return "";
            if(fieldText.charAt(fieldText.length()-1)=='d')
                throw new IllegalArgumentException();
            double y = Double.parseDouble(fieldText.replace(',', '.'));
            if (!(y >= minY && y <= maxY)) {
                logger.info(fieldText + " ;1 " + respText);
                throw new IllegalArgumentException();
            }
        } catch (Exception e) {
            logger.info(fieldText+" ;2 "+respText);
            fieldText="";
            return  "Введите корректное значение Y!";
        }
     return "";}
}
