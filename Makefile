PROJECT_NAME = viralert

# Define the expo version
EXPO_VERSION = 51

# Commands
start:
	@echo "Starting Expo project (version $(EXPO_VERSION))..."
	@npx expo start -c

build:
	@echo "Building with eas"
	@eas build

build-android:
	@echo "Building Android APK..."
	@npx expo build:android

build-android-local:
	@echo "Build local android build "
	@yarn expo run:android


build-ios:
	@echo "Creating developpement build for IOS"
	@eas build --profile development --platform ios

build-ios-local:
	@echo "Build local ios build "
	@yarn expo run:ios

build-sim-android:
	@echo "Building for android simulator"
	@eas build --profile development --platform android

build-sim-ios:
	@echo "Building for ios simulator"
	@eas build --profile development-simulator --platform ios

build-local-sim-ios:
	@echo "Building for ios simulator in local for debug "
	@eas build --profile development-simulator --platform ios --local


create-ios-device:
	@echo "Register ios device you would like to develop onto"
	@eas device:create

clean:
	@echo "Cleaning project..."
	@rm -rf .expo
	@rm -rf node_modules
	@rm -rf ios
	@rm -rf android
	@echo "Clean complete."

install:
	@echo "Installing dependencies..."
	@yarn

check: 
	@yarn tsc

doctor:
	@echo "Doctor is working..."
	@npx expo-doctor@latest
.PHONY: start build-android build-ios clean install

env:

