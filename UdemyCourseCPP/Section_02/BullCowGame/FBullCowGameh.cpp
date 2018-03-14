#include "FBullCowGameh.h"
#include <map>

#define TMap std::map

FBullCowGame::FBullCowGame(){Reset();}

int32 FBullCowGame::GetCurrentTry() const {return MyCurrentTry;}

int32 FBullCowGame::GetHiddenWordLength() const {return MyHiddenWord.length();}

bool FBullCowGame::IsGameWon() const { return bGameIsWon;}

int32 FBullCowGame::GetMaxTries() const {
	TMap<int32, int32> WordLengthToMaxTries{
		{3,4},{4,7},{5,9},{6,14}
	};
	return WordLengthToMaxTries[MyHiddenWord.length()]; 
}


void FBullCowGame::Reset()
{
	const FString HIDDEN_WORD = "planet";
	MyHiddenWord = HIDDEN_WORD;

	bGameIsWon = false;
	MyCurrentTry = 1;
	return;
}


EGuessStatus FBullCowGame::CheckGuessValidity(FString Guess) const
{
	if (!IsIsogram(Guess))// If guess isn't an isogram
	{
		// return an error
		return EGuessStatus::Not_Isogram;
	}
	else if (!IsLowercase(Guess))// if guess isn't all lower case
	{	// return an error
		return EGuessStatus::Not_Lowercase;
	}
	else if (GetHiddenWordLength() != Guess.length())// if the guess length is wrong
	{
		// return an error
		return EGuessStatus::Wrong_Length;
	}
	else// otherwise
	{
		return EGuessStatus::Ok;// return OK
	}
}

// Receives a valid guess, increments turn a nd returns count
FBullCowCount FBullCowGame::SubmitValidGuess(FString Guess)
{
	MyCurrentTry++;
	FBullCowCount mBullCowCount;

	// loop through all letters in the hidden word 
	int32 WordLength = MyHiddenWord.length(); // Assuming same length as guess

	for (int32 MyHWChar = 0; MyHWChar < WordLength ; MyHWChar++)
	{
		// compare letters agains the guess word
		for (int32 GChar = 0; GChar < WordLength; GChar++)
		{
			// if they match
			if (MyHiddenWord[MyHWChar] == Guess[GChar])
			{
				// if they are in same place
				if (MyHWChar == GChar)
				{
					// increment bulls
					mBullCowCount.Bulls++;

				}
				// if not in same place
				else
				{
					// increment cows 
					mBullCowCount.Cows++;
				}
			}
		
		}
	}
	if (mBullCowCount.Bulls == WordLength)
	{
		bGameIsWon = true;
	}
	else
	{
		bGameIsWon = false;
	}
	return mBullCowCount;
}

bool FBullCowGame::IsIsogram(FString Word) const
{
	// treat 0 and 1 letter words as isograms
	if (Word.length() < 2) { return true; }
	// set up our map
	TMap<char, int32> LetterSeen;

	// loop through all the letters of the word
	for (auto Letter : Word)
	{
		Letter = tolower(Letter);
		// letter is in the map
		if (LetterSeen[Letter])
			// Is not an isogram
		{
			return false;
		}
		// otherwise
			// add the letter to the map as seen
		else
		{
			LetterSeen[Letter] = true;
		}
	}
	return true; // for example in cases where /0 is entered
}

bool FBullCowGame::IsLowercase(FString Word) const
{
	for (auto Letter : Word)
	{
		if (isupper(Letter)) { return false;}
	}
	return true;
}

