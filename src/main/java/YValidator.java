import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator("YValidator")
public class YValidator implements Validator {
    private static final double minY = -3;
    private static final double maxY = 5;
    public void validate(FacesContext facesContext, UIComponent uiComponent, Object o) throws ValidatorException {
        try {
            double y = Double.parseDouble(o.toString().replace(',', '.'));
            if (!(y >= minY && y <= maxY))
                throw new IllegalArgumentException();
        } catch (Exception e) {
            FacesMessage msg =
                    new FacesMessage("Y validation failed.",
                            "Неверный параметр Y, пожалуйста, повторите ввод.");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
    }
}
