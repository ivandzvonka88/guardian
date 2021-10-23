import React from 'react';
import {StyleSheet} from 'react-native';
import {Block, Text} from 'galio-framework';

import ShortTermGoal from './ShortTermGoal';

function LongTermObjectives({longTermObjectives, scoring, onChange}) {
  const handleChange = (objectiveId, goalId, score) => {
    const newLongTermObjectives = longTermObjectives.map((longTerm) => {
      if (longTerm.objectiveId === objectiveId) {
        return {
          ...longTerm,
          shortTermGoals: longTerm.shortTermGoals.map((shortTerm) => {
            if (shortTerm.goalId === goalId) {
              return {
                ...shortTerm,
                score,
              };
            }
            return shortTerm;
          }),
        };
      }

      return longTerm;
    });

    onChange(newLongTermObjectives);
  };

  return (
    <Block style={styles.block}>
      {longTermObjectives &&
        longTermObjectives.map((o) => (
          <Block key={o.objectiveId}>
            <Text style={styles.text}>{o.longTermVision}</Text>
            <Text bold style={styles.blockTitle}>
              Long Term Goal(s)
            </Text>
            <Text style={styles.text}>{o.longTermGoal}</Text>
            {o.shortTermGoals.map((g) => (
              <ShortTermGoal
                key={g.goalId}
                text={g.shortTermGoal}
                score={g.score}
                options={scoring}
                onChange={(score) =>
                  handleChange(o.objectiveId, g.goalId, score)
                }
              />
            ))}
          </Block>
        ))}
    </Block>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: 15,
  },
  blockTitle: {
    fontSize: 16,
    marginTop: 10,
    color: 'white',
  },
  text: {
    fontSize: 14,
    marginVertical: 5,
    color: 'white',
  },
});

export default LongTermObjectives;
