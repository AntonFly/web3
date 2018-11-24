

public final class MatchingManager {
    private static final double minX = -5;
    private static final double maxX = 5;
    private static final double minY = -5;
    private static final double maxY = 5;
    private static final double minR=1;
    private static final double maxR=5;


    public static boolean validate(double x, double y, double r) {
        return ((minX <= x && maxX >= x) && (minY <= y && maxY >= y) &&(minR <= r && maxR >= r));
    }

    public static boolean isInArea(double x, double y, double r) {
        return (y >= 0 && x >= 0 && x <= r  && y <= r/2) ||     //rectangle
                (x >= 0 && y <= 0 && y >= -2*x - r ) ||      //triangle
                (y >= 0 && x <= 0 && x * x + y * y <= r * r );   //circle
    }
}