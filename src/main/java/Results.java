import javax.annotation.PreDestroy;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpSession;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.FileHandler;
import java.util.logging.Logger;

@ManagedBean(name = "results")
@SessionScoped
public class Results {
    private final Connection connection;
    /*private static final String DB_URL = "jdbc:postgresql://127.0.0.1:5432/postgres";
    private static final String USER = "postgres";
    private static final String PASS = "iaq150";*/
    private static final String DB_URL = "jdbc:postgresql://pg:5432/studs";
    private static final String USER = "s242461";
    private static final String PASS = "ybb203";
    private static final String TABLE_NAME = "results";
    private final String sessionID;
    private final Logger logger;

    {
        connection = new JDBCManager(DB_URL, USER, PASS, true).getConnection();
        FacesContext fCtx = FacesContext.getCurrentInstance();
        HttpSession session = (HttpSession) fCtx.getExternalContext().getSession(false);
        sessionID = session.getId();
        logger = Logger.getLogger("logger");
        try {
            logger.addHandler(new FileHandler("log.txt"));
        } catch (Exception e) {
            logger.info(e.getMessage());
        }
    }

    public int addResult() {
        Map<String, String> requestParameterMap = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();
        String xstr = requestParameterMap.get("form:param-x_input");
        String ystr = requestParameterMap.get("form:param-y");
        String rstr = requestParameterMap.get("form:param-r");
        logger.info("X=" + xstr);
        logger.info("Y=" + ystr);
        logger.info("R" + rstr);
        double x;
        double y;
        double r;
        try {
            x = Double.parseDouble(xstr.replace(',', '.'));
            y = Double.parseDouble(ystr.replace(',', '.'));
            r = Double.parseDouble(rstr.replace(',', '.'));
        } catch (Exception e) {
            return -1;
        }
        if (!MatchingManager.valid(x, y, r))
            return -1;
        boolean check = MatchingManager.match(x, y, r);
        StringBuilder result = new StringBuilder();
        result.append("INSERT INTO ");
        result.append(TABLE_NAME);
        result.append(" (x,y,r,checking,sessionID) VALUES (");
        result.append(x);
        result.append(",");
        result.append(y);
        result.append(",");
        result.append(r);
        result.append(",'");
        result.append(check);
        result.append("','");
        result.append(sessionID);
        result.append("');");
        logger.info("try");
        try {
            return connection.createStatement().executeUpdate(result.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        logger.info("added");
        return -1;
    }

    public List<ResultRow> getAllResults() {
        List<ResultRow> resultRows = new ArrayList<ResultRow>();
        try {
            ResultSet resultSet = connection.createStatement().executeQuery("SELECT * FROM " + TABLE_NAME +
                    " WHERE sessionID = '" + sessionID + "';");
            while (resultSet.next()) {
                ResultRow resultRow = new ResultRow();
                resultRow.setX(resultSet.getString("x"));
                resultRow.setY(resultSet.getString("y"));
                resultRow.setR(resultSet.getString("r"));
                resultRow.setMatch(resultSet.getString("checking").contains("t"));
                resultRows.add(resultRow);
            }
            resultSet.close();
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return resultRows;
    }

    @PreDestroy
    private void clearResults() {
        try {
            connection.createStatement().executeUpdate("DELETE FROM " + TABLE_NAME +
                    " WHERE sessionID = '" + sessionID + "';");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
