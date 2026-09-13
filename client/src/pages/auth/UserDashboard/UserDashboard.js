import { Link } from 'react-router-dom';
import { DashboardContainer, DashboardCard, DashboardTitle } from './DashboardElements';
import { DashboardButtonContainer } from './UserDashboard.styles';

function UserDashboard() {
  return (
    <DashboardContainer>
      <DashboardCard>
        <DashboardTitle>AI Conversation Experiment</DashboardTitle>

        <DashboardButtonContainer>
          <Link to="/pregame">
            <button>Pre-game Survey</button>
          </Link>

          <Link to="/game">
            <button>Game</button>
          </Link>

          <Link to="/postgame">
            <button>Post-game Survey</button>
          </Link>

          <Link to="/data">
            <button>View My Data</button>
          </Link>
        </DashboardButtonContainer>
      </DashboardCard>
    </DashboardContainer>
  );
}

export default UserDashboard;
