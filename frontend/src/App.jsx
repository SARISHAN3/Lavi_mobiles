import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrderProvider } from "./context/OrderContext";
import { ProductProvider } from "./context/ProductContext";
import { CategoryProvider } from "./context/CategoryContext";
import { BrandProvider } from "./context/BrandContext";
import { ReviewProvider } from "./context/ReviewContext";
import { CouponProvider } from "./context/CouponContext";
import { DashboardProvider } from "./context/DashboardContext";
import { SettingProvider } from "./context/SettingContext";

import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <CategoryProvider>
            <BrandProvider>
              <CartProvider>
                <WishlistProvider>
                  <OrderProvider>
                    <ReviewProvider>
                      <CouponProvider>
                        <DashboardProvider>
                          <SettingProvider>
                            <AppRoutes />
                          </SettingProvider>
                        </DashboardProvider>
                      </CouponProvider>
                    </ReviewProvider>
                  </OrderProvider>
                </WishlistProvider>
              </CartProvider>
            </BrandProvider>
          </CategoryProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
