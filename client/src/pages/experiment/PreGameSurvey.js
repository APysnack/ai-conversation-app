import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  SurveyContainer,
  SurveyCard,
  Instructions,
  Question,
  SelectionOptions,
  SelectionOption,
  Options,
  Option,
  ScaleLabel,
} from './PreGameSurvey.styles';

import {
  ageOptions,
  genderOptions,
  raceEthnicityOptions,
  interestOptions,
  petOptions,
  collectionOptions,
} from './surveyOptions';

import { useTheme } from '../../context/ThemeContext';
import { updateUserSettings } from '../../store/thunks';

function PreGameSurvey() {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const [demographics, setDemographics] = useState({
    age: '',
    gender: '',
    raceEthnicity: '',
  });

  const [interests, setInterests] = useState([]);
  const [pets, setPets] = useState([]);
  const [collections, setCollections] = useState([]);

  const [answers, setAnswers] = useState({
    comfort: '',
    personalInformation: '',
    hiddenFact: '',
  });

  useEffect(() => {
    console.log('Demographics:', demographics);
  }, [demographics]);

  useEffect(() => {
    console.log('Interests:', interests);
  }, [interests]);

  useEffect(() => {
    console.log('Pets:', pets);
  }, [pets]);

  useEffect(() => {
    console.log('Collections:', collections);
  }, [collections]);

  useEffect(() => {
    console.log('Answers:', answers);
  }, [answers]);

  const handleDemographic = (question, value) => {
    setDemographics((previous) => ({
      ...previous,
      [question]: value,
    }));
  };

  const handleInterest = (interest) => {
    setInterests((previous) =>
      previous.includes(interest)
        ? previous.filter((item) => item !== interest)
        : [...previous, interest]
    );
  };

  const handlePet = (pet) => {
    setPets((previous) =>
      previous.includes(pet) ? previous.filter((item) => item !== pet) : [...previous, pet]
    );
  };

  const handleCollection = (collection) => {
    setCollections((previous) =>
      previous.includes(collection)
        ? previous.filter((item) => item !== collection)
        : [...previous, collection]
    );
  };

  const handleAnswer = (question, value) => {
    setAnswers((previous) => ({
      ...previous,
      [question]: value,
    }));
  };

  const handleSubmit = async () => {
    const formData = {
      survey: {
        comfort: answers.comfort,
        personalInformation: answers.personalInformation,
        hiddenFact: answers.hiddenFact,
        interests,
        pets,
        collections,
        demographics,
      },
    };

    console.log('Form submission:', formData);

    const result = await dispatch(updateUserSettings(formData));

    if (updateUserSettings.fulfilled.match(result)) {
      console.log('Survey successfully saved!');
    } else {
      console.error('Failed to save survey:', result.payload);
    }
  };

  return (
    <SurveyContainer $background={theme.colors.background}>
      <SurveyCard $background={theme.colors.card}>
        {/* COMFORT */}

        <Question $background={theme.colors.primaryButton} $color="white">
          How comfortable are you meeting and talking with someone you’ve never met before?
        </Question>

        <Options>
          {[1, 2, 3, 4, 5, 6, 7].map((value) => (
            <Option
              key={value}
              type="radio"
              name="comfort"
              value={value}
              checked={answers.comfort === value.toString()}
              onChange={(event) => handleAnswer('comfort', event.target.value)}
            />
          ))}
        </Options>

        <ScaleLabel $color={theme.colors.text}>
          <span>Aghh new people scare me</span>
          <span>Neutral</span>
          <span>I love meeting new people</span>
        </ScaleLabel>

        {/* PERSONAL INFORMATION */}

        <Question $background={theme.colors.primaryButton} $color="white">
          How comfortable are you sharing personal information with someone you’ve just met?
        </Question>

        <Options>
          {[1, 2, 3, 4, 5, 6, 7].map((value) => (
            <Option
              key={value}
              type="radio"
              name="personalInformation"
              value={value}
              checked={answers.personalInformation === value.toString()}
              onChange={(event) => handleAnswer('personalInformation', event.target.value)}
            />
          ))}
        </Options>

        <ScaleLabel $color={theme.colors.text}>
          <span>I take a while to warm up to new people</span>
          <span>Neutral</span>
          <span>There's no such thing as TMI</span>
        </ScaleLabel>

        {/* INTERESTS */}

        <Question $background={theme.colors.primaryButton} $color="white">
          What are you genuinely interested in?
        </Question>

        <Instructions $color={theme.colors.text}>Select all that apply.</Instructions>

        <SelectionOptions>
          {interestOptions.map(([emoji, interest]) => (
            <SelectionOption
              key={interest}
              type="button"
              $selected={interests.includes(interest)}
              $background={theme.colors.card}
              $selectedBackground={theme.colors.primaryButton}
              $border={theme.colors.cardBorder}
              $color={theme.colors.text}
              onClick={() => handleInterest(interest)}
            >
              <span>{emoji}</span>
              {interest}
            </SelectionOption>
          ))}
        </SelectionOptions>

        {/* PETS */}

        <Question $background={theme.colors.primaryButton} $color="white">
          What types of pets have you lived with?
        </Question>

        <Instructions $color={theme.colors.text}>Select all that apply.</Instructions>

        <SelectionOptions>
          {petOptions.map(([emoji, pet]) => (
            <SelectionOption
              key={pet}
              type="button"
              $selected={pets.includes(pet)}
              $background={theme.colors.card}
              $selectedBackground={theme.colors.primaryButton}
              $border={theme.colors.cardBorder}
              $color={theme.colors.text}
              onClick={() => handlePet(pet)}
            >
              <span>{emoji}</span>
              {pet}
            </SelectionOption>
          ))}
        </SelectionOptions>

        {/* COLLECTIONS */}

        <Question $background={theme.colors.primaryButton} $color="white">
          Have you ever collected something?
        </Question>

        <Instructions $color={theme.colors.text}>Select all that apply.</Instructions>

        <SelectionOptions>
          {collectionOptions.map(([emoji, collection]) => (
            <SelectionOption
              key={collection}
              type="button"
              $selected={collections.includes(collection)}
              $background={theme.colors.card}
              $selectedBackground={theme.colors.primaryButton}
              $border={theme.colors.cardBorder}
              $color={theme.colors.text}
              onClick={() => handleCollection(collection)}
            >
              <span>{emoji}</span>
              {collection}
            </SelectionOption>
          ))}
        </SelectionOptions>

        {/* SOMETHING PEOPLE WOULDN'T GUESS */}

        <Question $background={theme.colors.primaryButton} $color="white">
          What's one thing people wouldn't guess about you?
        </Question>

        <Instructions $color={theme.colors.text}>Share anything you'd like!</Instructions>

        <textarea
          value={answers.hiddenFact}
          onChange={(event) => handleAnswer('hiddenFact', event.target.value)}
          placeholder="Tell us something interesting about yourself..."
          rows={4}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${theme.colors.cardBorder}`,
            background: theme.colors.card,
            color: theme.colors.text,
            fontSize: '16px',
            resize: 'vertical',
          }}
        />

        {/* DEMOGRAPHICS */}

        <Question $background={theme.colors.primaryButton} $color="white">
          Age
        </Question>

        <Instructions $color={theme.colors.text}>
          Optional — you may skip this question.
        </Instructions>

        <SelectionOptions>
          {ageOptions.map((age) => (
            <SelectionOption
              key={age}
              type="button"
              $selected={demographics.age === age}
              $background={theme.colors.card}
              $selectedBackground={theme.colors.primaryButton}
              $border={theme.colors.cardBorder}
              $color={theme.colors.text}
              onClick={() => handleDemographic('age', age)}
            >
              {age}
            </SelectionOption>
          ))}
        </SelectionOptions>

        {/* GENDER */}

        <Question $background={theme.colors.primaryButton} $color="white">
          Gender
        </Question>

        <Instructions $color={theme.colors.text}>
          Optional — you may skip this question.
        </Instructions>

        <SelectionOptions>
          {genderOptions.map((gender) => (
            <SelectionOption
              key={gender}
              type="button"
              $selected={demographics.gender === gender}
              $background={theme.colors.card}
              $selectedBackground={theme.colors.primaryButton}
              $border={theme.colors.cardBorder}
              $color={theme.colors.text}
              onClick={() => handleDemographic('gender', gender)}
            >
              {gender}
            </SelectionOption>
          ))}
        </SelectionOptions>

        {/* RACE / ETHNICITY */}

        <Question $background={theme.colors.primaryButton} $color="white">
          Race/ethnicity
        </Question>

        <Instructions $color={theme.colors.text}>
          Optional — you may skip this question.
        </Instructions>

        <SelectionOptions>
          {raceEthnicityOptions.map((raceEthnicity) => (
            <SelectionOption
              key={raceEthnicity}
              type="button"
              $selected={demographics.raceEthnicity === raceEthnicity}
              $background={theme.colors.card}
              $selectedBackground={theme.colors.primaryButton}
              $border={theme.colors.cardBorder}
              $color={theme.colors.text}
              onClick={() => handleDemographic('raceEthnicity', raceEthnicity)}
            >
              {raceEthnicity}
            </SelectionOption>
          ))}
        </SelectionOptions>

        {/* SUBMIT */}

        <button
          type="button"
          onClick={handleSubmit}
          style={{
            marginTop: '30px',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            background: theme.colors.primaryButton,
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </SurveyCard>
    </SurveyContainer>
  );
}

export default PreGameSurvey;
