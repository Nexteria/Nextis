import React from 'react';

// core components
import ItemGrid from 'components/Grid/ItemGrid';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from 'components/CustomButtons/Button';

import GridContainer from 'components/Grid/GridContainer';
import PlusIcon from '@material-ui/icons/AddCircleOutline';
import AddLectorDialog from 'views/Admin/Events/AddLectorDialog';

import avatarImg from 'assets/img/default-avatar.png';

const styles = {
  img: {
    width: '100%',
    height: '100%',
    verticalAlign: 'middle',
    border: '0',
    borderRadius: '50px',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.8)',
  },
  avatarContainer: {
    position: 'relative',
    width: '100px',
    height: '100px',
    margin: 'auto',
    marginBottom: '0.5em',
  },
  cardTitle: {
    textAlign: 'center',
  },
  addButton: {
    width: '100%',
    height: '100%',
  }
};

class Lectors extends React.Component {
  state = {
    isAddingLector: false,
  }

  render() {
    const { lectors, classes, event } = this.props;
    const { isAddingLector } = this.state;

    return (
      <GridContainer>
        <ItemGrid xs={12}>
          <h1>
            Lektori
          </h1>
        </ItemGrid>

        {lectors && lectors.map(lector => (
          <ItemGrid key={lector.id} xs={12} sm={4} md={3} lg={2}>
            <Card className={classes.cardClasses}>
              <CardContent className={classes.cardContent}>
                <h6 className={classes.cardTitle}>
                  {`${lector.firstName} ${lector.lastName}`}
                </h6>

                <div className={classes.avatarContainer}>
                  <img
                    src={lector.profilePicture
                      ? lector.profilePicture.filePath
                      : avatarImg
                    }
                    alt={`${lector.firstName} ${lector.lastName}`}
                    className={classes.img}
                  />
                </div>
              </CardContent>
            </Card>
          </ItemGrid>
        ))}

        <ItemGrid xs={12} sm={4} md={3} lg={2}>
          <Button
            color="success"
            size="lg"
            round
            onClick={() => this.setState({ isAddingLector: true })}
          >
            <PlusIcon />
          </Button>
        </ItemGrid>

        {isAddingLector
          ? (
            <AddLectorDialog
              event={event}
              onClose={() => this.setState({ isAddingLector: false })}
            />
          )
          : null
        }
      </GridContainer>
    );
  }
}

export default withStyles(styles)(Lectors);
