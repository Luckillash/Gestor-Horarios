import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'LicenciaWebPartStrings';
import Rutas from './components/Rutas';
import { IComponentProps } from './interfaces/IComponentProps';
import { getSP } from '../../pnp/pnpConfig';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import CSS from "./components/Licencia.module.scss"

export interface ILicenciaWebPartProps {

	description: string;

}

export default class LicenciaWebPart extends BaseClientSideWebPart<ILicenciaWebPartProps> {

	private _isDarkTheme: boolean = false;

	private _environmentMessage: string = '';

	public render(): void {

		const ComponentProps = {

			width: this.width,

			description: this.properties.description,

			isDarkTheme: this._isDarkTheme,

			environmentMessage: this._environmentMessage,

			hasTeamsContext: !!this.context.sdks.microsoftTeams,

			userDisplayName: this.context.pageContext.user.displayName,

			pageContext: this.context.pageContext
			
		}

		const Element: React.ReactElement<IComponentProps> = React.createElement(Rutas, ComponentProps);

		const FluentComponentsProvider: React.ReactElement = React.createElement(FluentProvider, { theme: webLightTheme }, Element)

		const ReduxProvider: React.ReactElement = React.createElement(Provider, { store } as any, FluentComponentsProvider)

		ReactDom.render(ReduxProvider, this.domElement);

	}

	protected async onInit(): Promise<void> {

		this._getEnvironmentMessage()

		await super.onInit();

		getSP(this.context);

		// GetGraph(this.context);

	}

	private _getEnvironmentMessage(): string {

		if (!!this.context.sdks.microsoftTeams) return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
		
		return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;

	}

	protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {

		if (!currentTheme) return;
		
		this._isDarkTheme = !!currentTheme.isInverted;

		const { semanticColors } = currentTheme;

		if (semanticColors) {

			this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
			
			this.domElement.style.setProperty('--link', semanticColors.link || null);
			
			this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);

		}

	}

	protected onDispose(): void {

		ReactDom.unmountComponentAtNode(this.domElement);

	}

	protected get dataVersion(): Version {

		return Version.parse('1.0');
		
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

		return {
			pages: [
				{
				header: {
					description: strings.PropertyPaneDescription
				},
				groups: [
					{
					groupName: strings.BasicGroupName,
					groupFields: [
						PropertyPaneTextField('description', {
						label: strings.DescriptionFieldLabel
						})
					]
					}
				]
				}
			]
		};

	}
	
}
