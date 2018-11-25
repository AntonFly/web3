

import java.util.logging.FileHandler;
import java.util.logging.Logger;
import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.context.FacesContext;

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
            fieldText=fieldText.trim();
            if(fieldText.equals("") || fieldText.equals(" ")) return " ";
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
    public void showMessage() {
        FacesMessage message = new FacesMessage("Заголовок", "Частичное обновление страницы");
        message.setSeverity(FacesMessage.SEVERITY_INFO); //как выглядит окошко с сообщением
        FacesContext.getCurrentInstance().addMessage(null, message);

        FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(FacesMessage.SEVERITY_ERROR,"Всплывашка", "GrowlMessage"));

        FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(FacesMessage.SEVERITY_FATAL,"Значение","dsdfsdf"));
}
}
