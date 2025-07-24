import tevaLogo from "./assets/images/teva-logo.svg";
import "./App.css";
import { Container, Navbar } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import { DEAL_ROUTES } from "./constants/routes";
import useScreenSize from "./hooks/useScreenSize";
import ClientAndBidInformation from "./components/ClientAndBidInformation";
import UtilizationAndMSData from "./components/UtilizationAndMSData";
import DealAnalysisModel from "./components/DealAnalysisModel";
import FinancialData from "./components/FinancialData";
import { FinancialTable } from "./components/FinancialTable";

function App() {
  const isDesktop = useScreenSize();

  if (!isDesktop) {
    return (
      <Container className="d-flex justify-content-center">
        This app is only available on Desktop
      </Container>
    );
  }

  return (
    <Container fluid>
      <Navbar className="justify-content-center py-5">
        <Container className="d-flex justify-content-center">
          <img
            src={tevaLogo}
            className="d-inline-block align-top teva-logo"
            alt="Teva"
          />
        </Container>
      </Navbar>
      <Routes>
        <Route path={DEAL_ROUTES.HOME.PATH} element={<ClientAndBidInformation />} />
        <Route path={DEAL_ROUTES.UTILIZATIONANDMSDATA.PATH} element={<UtilizationAndMSData />} />
        <Route path={DEAL_ROUTES.DEAL_ANALYSIS_MODEL.PATH} element={<DealAnalysisModel />} />
        <Route path={DEAL_ROUTES.FINANCIAL_DATA_FORM.PATH} element={<FinancialData />} />
        <Route path={DEAL_ROUTES.FINANCIAL_RESULTS_TABLE.PATH} element={<FinancialTable />} />
      </Routes>
    </Container>
  );
}

export default App;
